const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const ForbiddenError = require("../exceptions/ForbiddenError");

class PlaylistsServices {
  constructor() {
    this._pool = new Pool();

    this.addPlaylists = this.addPlaylists.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.postPlaylistSong = this.postPlaylistSong.bind(this);
    this.getPlaylistSong = this.getPlaylistSong.bind(this);
    this.deletePlaylistSong = this.deletePlaylistSong.bind(this);
  }

  async addPlaylists({ credentialId, name }) {
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO playlists (id, name, username) VALUES ($1, $2, $3)`,
      values: [id, name, credentialId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }
    return id;
  }

  async getPlaylist(userId) {
    const query = {
      text: `SELECT * FROM playlists WHERE username = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Playlist tidak ditemukan!");
    }
    return result.rows;
  }

  async deletePlaylist({ credentialId, id }) {
    const query = {
      text: `DELETE FROM playlists WHERE id = $1 AND username = $2 RETURNING id`,
      values: [id, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Playlist tidak ditemukan");
    }
  }

  async postPlaylistSong({ id, songId }) {
    const query = {
      text: `INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)`,
      values: [id, songId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }
    return id;
  }

  async getPlaylistSong(id) {
    const query = {
      text: `SELECT * FROM playlist_songs WHERE playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak di temukan");
    }
    const songs = await Promise.all(result.rows.map((song) => this.getSongDetail(song.song_id)));
    return songs;
  }

  async getPlaylistName(id) {
    const query = {
        text: `SELECT name FROM playlists WHERE id = $1`,
        values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
        throw new NotFoundError("Gagal mencari detail playlist");
    }
    return result.rows[0].name;
  }

  async getUsername(credentialId) {
    const query = {
      text: "SELECT username FROM users WHERE id = $1",
      values: [credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0].username;
  }

  async getSongDetail(id) {
    const query = {
        text: `SELECT * FROM songs WHERE id = $1`,
        values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
        throw new NotFoundError("Gagal mencari song");
    }
    return {
        id: result.rows[0].id,
        title: result.rows[0].title,
        performer: result.rows[0].performer,
    };
  }

  async deletePlaylistSong({ songId, id }) {
    const query = {
      text: `DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING song_id`,
      values: [id, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Gagal menghapus Song dari Playlist");
    }
  }

  async checkSongId(songId) {
    const query = {
      text: `SELECT * FROM songs WHERE id = $1`,
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan ");
    }
  }

  async matchPlaylistCredential({ credentialId, id }) {
    const query = {
        text: `SELECT * FROM playlists WHERE id = $1 AND username = $2`,
        values: [id, credentialId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
        throw new ForbiddenError("Playlist bukan milik anda");
    }
  }
}
module.exports = PlaylistsServices;
