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
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    username: {
      type: "TEXT",
      notNull: true,
    },
  });
  pgm.createTable("playlist_songs", {
    playlist_id: { type: "varchar(255)", notNull: true },
    song_id: { type: "varchar(255)", notNull: true },
  });
  pgm.addConstraint("playlist_songs", "pk_playlist_songs", {
    primaryKey: ["playlist_id", "song_id"],
  });
  pgm.addConstraint("playlist_songs", "fk_playlist_songs_playlist", {
    foreignKeys: {
      columns: "playlist_id",
      references: "Playlists(id)",
      onDelete: "CASCADE",
    },
  });
  pgm.addConstraint("playlist_songs", "fk_playlist_songs_song", {
    foreignKeys: {
      columns: "song_id",
      references: "Songs(id)",
      onDelete: "CASCADE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("playlist_songs", "fk_playlist_songs_playlist");
  pgm.dropTable("playlist_songs");
  pgm.dropTable("playlists");
};
