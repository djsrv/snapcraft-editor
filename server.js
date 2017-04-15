/*

    server.js

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

function Server(settings) {
    this.init(settings);
}

Server.prototype.init = function (settings) {
    console.log('Initializing server for ' + settings.name + '...');
    this.name = settings.name;
    this.port = settings.port;
    this.globalVariables = new VariableFrame();
    this.stage = new Stage({
        name: this.name,
        globals: this.globalVariables,
        server: this
    });
    this.app = null;
    this.server = null;
    this.io = null;
    this.stageSettings = this.collectStageSettings();
    this.wasPaused = this.stage.threads.isPaused();
    this.initServer();
};

Server.prototype.initServer = function () {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = io(this.server);
    this.server.listen(this.port);
    this.app.use(express.static(path.join(__dirname, '../snapcraft-js')));
    this.app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
    this.io.on('connection', this.onConnection.bind(this));
    console.log('Server listening on port ' + this.port);
};

Server.prototype.collectStageSettings = function () {
    var settings = {};
    settings.isFastTracked = this.stage.isFastTracked;
    settings.enableCustomHatBlocks = this.stage.enableCustomHatBlocks;
    settings.isThreadSafe = this.stage.isThreadSafe;
    settings.pauseCustomHatBlocks = this.stage.threads.pauseCustomHatBlocks;
    return settings;
};

Server.prototype.tick = function () {
    this.updateIsPaused();
    setTimeout(this.tick.bind(this), 1000);
};

/* Client -> Server */

Server.prototype.onConnection = function (socket) {
    var myself = this;

    console.log('New connection with ID ' + socket.id);

    socket.on('set_stage_setting', this.setStageSettingFromClient.bind(this, socket));
    socket.on('green_flag', this.greenFlagFromClient.bind(this, socket));
    socket.on('stop_all', this.stopAllFromClient.bind(this, socket));
    socket.on('pause_all', this.pauseAllFromClient.bind(this, socket));
    socket.on('resume_all', this.resumeAllFromClient.bind(this, socket));

    this.initIDE(socket);
};

Server.prototype.setStageSettingFromClient = function (socket, data) {
    var valid = false;
    var stageProps = [
        'isFastTracked',
        'enableCustomHatBlocks',
        'isThreadSafe'
    ];
    var threadsProps = [
        'pauseCustomHatBlocks'
    ];

    if (stageProps.indexOf(data.name) > -1) {
        this.stage[data.name] = data.value;
        valid = true;
    }
    if (threadsProps.indexOf(data.name) > -1) {
        this.stage.threads[data.name] = data.value;
        valid = true;
    }

    if (valid) {
        console.log(socket.id + ' set setting ' + data.name + ' to ' + data.value);
        this.updateStageSetting(data.name, data.value);
    } else {
        console.log(socket.id + ' tried to set invalid setting ' + data.name + ' to ' + data.value);
    }
};

Server.prototype.greenFlagFromClient = function (socket, data) {
    console.log(socket.id + ' fired a green flag event');
    this.stage.fireGreenFlagEvent();
};

Server.prototype.stopAllFromClient = function (socket, data) {
    console.log(socket.id + ' fired a stop all event');
    this.stage.fireStopAllEvent();
};

Server.prototype.pauseAllFromClient = function (socket, data) {
    console.log(socket.id + ' paused all');
    this.stage.threads.pauseAll(this.stage);
};

Server.prototype.resumeAllFromClient = function (socket, data) {
    console.log(socket.id + ' resumed all');
    this.stage.threads.resumeAll(this.stage);
};

/* Server -> Client */

Server.prototype.initIDE = function (socket) {
    socket.emit('init_ide', {
        name: this.name,
        serverStageSettings: this.stageSettings,
        serverIsPaused: this.wasPaused
    });
};

/* Server -> All Clients */

Server.prototype.updateStageSetting = function (name, value) {
    console.log('Updating setting ' + name + ' to ' + value);
    this.stageSettings[name] = value;
    this.io.emit('update_stage_setting', {
        name: name,
        value: value
    });
};

Server.prototype.updateIsPaused = function () {
    var isPaused = this.stage.threads.isPaused();
    if (isPaused !== this.wasPaused) {
        console.log('Updating isPaused to ' + isPaused);
        this.wasPaused = isPaused;
        this.io.emit('update_isPaused', function () {
            flag: isPaused
        });
    }
};

var server = new Server({
    name: 'Overworld',
    port: 4747
});
server.tick();
