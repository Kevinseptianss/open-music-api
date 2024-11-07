/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.alterColumn("songs", "albumid", {
    type: "TEXT",
    notNull: false,
  });

  pgm.alterColumn("songs", "duration", {
    type: "INTEGER",
    notNull: false,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.alterColumn("songs", "albumid", {
    type: "TEXT",
    notNull: true,
  });

  pgm.alterColumn("songs", "duration", {
    type: "INTEGER",
    notNull: true,
  });
};
