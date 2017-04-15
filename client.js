/*

    client.js

    Copyright (C) 2017 by Dylan Servilla

    This file is part of SnapCraft!.

    SnapCraft! is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

function Client(world) {
    this.init(world);
}

Client.prototype.init = function (world) {
    this.world = world;
    this.ide = null;
    this.socket = io('http://localhost:4747');
    this.socket.on('init_ide', this.initIDEFromServer.bind(this));
    this.socket.on('update_stage_setting', this.updateStageSettingFromServer.bind(this));
    this.socket.on('update_isPaused', this.updateIsPausedFromServer.bind(this));
};

/* Server -> Client */

Client.prototype.initIDEFromServer = function (data) {
    data.client = this;
    this.ide = new IDE_Morph(data);
    this.ide.openIn(this.world);
};

Client.prototype.updateStageSettingFromServer = function (data) {
    this.ide.stage.serverSettings[data.name] = data.value;
    if (data.name === 'pauseCustomHatBlocks') {
        this.ide.controlBar.stopButton.refresh();
    }
};

Client.prototype.updateIsPausedFromServer = function (data) {
    this.ide.stage.serverIsPaused = data.flag;
    this.ide.controlBar.pauseButton.refresh();
};

/* Client -> Server */

Client.prototype.setStageSetting = function (name, value) {
    this.socket.emit('set_stage_setting', {
        name: name,
        value: value
    });
};

Client.prototype.fireGreenFlagEvent = function () {
    this.socket.emit('green_flag');
};

Client.prototype.fireStopAllEvent = function () {
    this.socket.emit('stop_all');
};

Client.prototype.pauseAll = function () {
    this.socket.emit('pause_all');
};

Client.prototype.resumeAll = function () {
    this.socket.emit('resume_all');
};
