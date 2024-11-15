class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistsHandler = this.deletePlaylistsHandler.bind(this);
    this.postPlaylistsSongHandler = this.postPlaylistsSongHandler.bind(this);
    this.getPlaylistsSongHandler = this.getPlaylistsSongHandler.bind(this);
    this.deletePlaylistsSongHandler =
      this.deletePlaylistsSongHandler.bind(this);
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePlaylist(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;
    const playlistId = await this._service.addPlaylists({ credentialId, name });

    const response = h.response({
      status: "success",
      message: "Playlist berhasil ditambahkan",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylist(credentialId);
    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._service.matchPlaylistCredential({ credentialId, id });
    await this._service.deletePlaylist({ credentialId, id });
    return {
      status: "success",
      message: "Playlist berhasil di hapus",
    };
  }

  async postPlaylistsSongHandler(request, h) {
    this._validator.validatePlaylistSong(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.matchPlaylistCredential({ credentialId, id });
    await this._service.checkSongId(songId)
    const playlistSong = await this._service.postPlaylistSong({ id, songId });
    const response = h.response({
      status: "success",
      message: "Song berhasil ditambahkan di playlist",
      data: {
        playlistSong,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsSongHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    const songs = await this._service.getPlaylistSong(id);
    await this._service.matchPlaylistCredential({ credentialId, id });
    const playlistName = await this._service.getPlaylistName(id);
    const username = await this._service.getUsername(credentialId);
    return {
      status: "success",
      data: {
        playlist: {
          id: id,
          name: playlistName,
          username: username,
          songs,
        }
      },
    };
  }

  async deletePlaylistsSongHandler(request, h) {
    this._validator.validatePlaylistSong(request.payload);
    const {id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._service.matchPlaylistCredential({ credentialId, id });
    await this._service.deletePlaylistSong({ id, songId });
    return {
      status: "success",
      message: "Song berhasil dihapus dari playlist",
    };
  }
}

module.exports = PlaylistsHandler;
