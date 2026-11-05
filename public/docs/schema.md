# Esquema de base de datos — desaf.io

Documento formal del esquema relacional, reglas de negocio y consultas de leaderboard.

---

## 1. Modelo conceptual

```
jugadores (1) ────────< partidas >──────── (1) desafios
```

| Tabla | Naturaleza | Campos clave |
|---|---|---|
| `jugadores` | entidad | `nombre` (único), `avatar_url` |
| `desafios` | catálogo / lookup | `tipo`, `dificultad`, `xp_base`, `parametros` |
| `partidas` | hecho transaccional (m2m) | `jugador_id`, `desafio_id`, `puntaje`, `tiempo_segundos`, `completado` |

- **No** hay tabla `leaderboards`: el leaderboard es una vista calculada (query) sobre `partidas`.
- **No** hay tablas por subtipo de desafío: los tipos se discriminan con `desafios.tipo` + `parametros JSON`.
- **No** hay columnas que guarden listas/arrays: cada intento es una fila (1FN).

---

## 2. Tablas (DDL completo)

> **Nota Postgres vs MySQL:** `INT GENERATED ALWAYS AS IDENTITY` es PostgreSQL. En MySQL se reemplaza por `INT AUTO_INCREMENT`.

```sql
-- ============================================================
-- JUGADORES
-- ============================================================
CREATE TABLE jugadores (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(60)  NOT NULL,
    avatar_url  VARCHAR(255),
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_jugadores_nombre UNIQUE (nombre)
);

-- ============================================================
-- DESAFIOS  (catálogo de tipos de desafío)
-- ============================================================
CREATE TABLE desafios (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,      -- 'Laberinto 4x4', 'Buscaminas', etc.
    tipo        VARCHAR(40)  NOT NULL,      -- discriminador: 'laberinto' | 'buscaminas' | ...
    dificultad  VARCHAR(20)  NOT NULL,      -- 'facil' | 'medio' | 'dificil'
    xp_base     INT NOT NULL CHECK (xp_base >= 0),  -- exp que da completarlo

    -- configuración específica del tipo (se lee completa, nunca se filtra por dentro)
    parametros  JSON,

    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_desafios_nombre UNIQUE (nombre),
    CONSTRAINT chk_desafios_tipo CHECK (tipo IN ('laberinto', 'buscaminas')),
    CONSTRAINT chk_desafios_dificultad CHECK (dificultad IN ('facil', 'medio', 'dificil'))
);

-- ============================================================
-- PARTIDAS  (relación muchos-a-muchos jugador <-> desafio + métricas)
-- ============================================================
CREATE TABLE partidas (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jugador_id      INT NOT NULL,
    desafio_id      INT NOT NULL,
    puntaje         INT NOT NULL CHECK (puntaje >= 0),
    tiempo_segundos INT CHECK (tiempo_segundos IS NULL OR tiempo_segundos >= 0),
    completado      BOOLEAN NOT NULL DEFAULT FALSE,   -- true solo si ganó/terminó
    fecha           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_partidas_jugador  FOREIGN KEY (jugador_id)
        REFERENCES jugadores(id) ON DELETE CASCADE,
    CONSTRAINT fk_partidas_desafio FOREIGN KEY (desafio_id)
        REFERENCES desafios(id)  ON DELETE CASCADE
);

-- ============================================================
-- ÍNDICES (performance de las queries de leaderboard)
-- ============================================================
-- leaderboard por desafío, ordenado por puntaje
CREATE INDEX idx_partidas_desafio_puntaje ON partidas (desafio_id, puntaje DESC);
-- filtra por jugador (perfil / historial)
CREATE INDEX idx_partidas_jugador ON partidas (jugador_id);
-- búsqueda global rápida si se necesita
CREATE INDEX idx_partidas_completado ON partidas (completado);
```

---

## 3. Reglas de negocio

| Regla | Definición |
|---|---|
| **R1 — Atomicidad (1FN)** | Ninguna columna guarda listas/arrays. Cada intento es una fila en `partidas`. |
| **R2 — Ranking por puntaje** | Se ordena por `puntaje DESC`. En empate de puntaje, desempata el menor `tiempo_segundos`. |
| **R3 — Mejor intento único** | En el leaderboard cada jugador aparece **una sola vez**, con su mejor partida. |
| **R4 — Mejor partida** | Para un jugador en un desafío, su "mejor" partida = mayor `puntaje`; si empata, menor `tiempo_segundos`. |
| **R5 — XP** | La experiencia es por **completar** (`completado = true`), y vale `desafios.xp_base`. No depende del puntaje. |
| **R6 — Integridad** | Borrar `jugador` o `desafio` borra sus `partidas` en cascada. |
| **R7 — Catálogo cerrado** | `tipo` y `dificultad` son enum restringidos por `CHECK`. |

---

## 4. Queries del leaderboard

### 4.1 Leaderboard de UN desafío (mejor intento por jugador)

```sql
-- Forma correcta: puntaje y tiempo SIEMPRE de la misma partida (la "mejor")
SELECT j.id, j.nombre, p.puntaje, p.tiempo_segundos,
       RANK() OVER (ORDER BY p.puntaje DESC, p.tiempo_segundos ASC) AS posicion
FROM partidas p
JOIN jugadores j ON j.id = p.jugador_id
WHERE p.desafio_id = :desafioId
  AND p.id = (
      SELECT p2.id
      FROM partidas p2
      WHERE p2.jugador_id = p.jugador_id
        AND p2.desafio_id = :desafioId
      ORDER BY p2.puntaje DESC, p2.tiempo_segundos ASC
      LIMIT 1
  )
ORDER BY p.puntaje DESC, p.tiempo_segundos ASC
LIMIT 10;
```

### 4.2 Leaderboard global (suma de puntos entre todos los desafíos)

```sql
SELECT j.id, j.nombre, SUM(p.puntaje) AS total_puntos,
       RANK() OVER (ORDER BY SUM(p.puntaje) DESC) AS posicion
FROM partidas p
JOIN jugadores j ON j.id = p.jugador_id
WHERE p.completado = TRUE
GROUP BY j.id, j.nombre
ORDER BY total_puntos DESC
LIMIT 10;
```

> **Nota:** el leaderboard global suma `puntaje`. Si en cambio se quiere ranking por **XP acumulada** (la recompensa real), usar `SUM(d.xp_base)` uniendo `desafios` y solo partidas `completado = true` (ver sección 6).

---

## 5. Consultas auxiliares

```sql
-- XP total de un jugador (recompensa real acumulada)
SELECT j.id, j.nombre, SUM(d.xp_base) AS xp_total
FROM partidas p
JOIN jugadores j ON j.id = p.jugador_id
JOIN desafios d ON d.id = p.desafio_id
WHERE p.completado = TRUE
GROUP BY j.id, j.nombre;

-- Historial de un jugador en un desafío (todos sus intentos)
SELECT puntaje, tiempo_segundos, completado, fecha
FROM partidas
WHERE jugador_id = :jugadorId AND desafio_id = :desafioId
ORDER BY fecha DESC;
```

---

## 6. Registro de una partida (lógica de inserción)

Cuando un jugador termina un desafío, se inserta **una fila nueva** (nunca se actualizan arrays):

```sql
INSERT INTO partidas (jugador_id, desafio_id, puntaje, tiempo_segundos, completado)
VALUES (:jugadorId, :desafioId, :puntaje, :tiempo, TRUE);
```

El ranking se **recalcula solo** con la query 4.1. No hay estado que mantener.

---

## 7. Puntos abiertos

1. **XP por completar:** el esquema asume que la XP se gana **solo** al completar (`completado = true`). Si un intento fallido también otorga XP, ajustar R5 y la query de XP.
2. **Ranking global:** definir si el ranking global es por suma de `puntaje` o por suma de `xp_base`.