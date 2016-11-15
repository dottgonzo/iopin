"use strict";
var child_process = require('child_process');
var Promise = require('bluebird');
var exec = child_process.exec;
var Relaypin = (function () {
    function Relaypin(confpin) {
        this.tags = [];
        if (!confpin.pin || (confpin.cmdopen && confpin.cmdclose)) {
            throw Error("no pin number provided");
        }
        else {
            var that_1 = this;
            if (confpin.pin)
                that_1.pin = confpin.pin;
            if (confpin.name)
                that_1.name = confpin.name;
            if (confpin.serial) {
                that_1.serial = confpin.serial;
            }
            else {
                that_1.serial = false;
            }
            if (confpin.status) {
                that_1.status = confpin.status;
            }
            else {
                that_1.status = that_1.normally;
            }
            if (confpin.normally) {
                that_1.normally = confpin.normally;
            }
            else {
                that_1.normally = "open";
            }
            if (confpin.tags) {
                for (var i = 0; i < confpin.tags.length; i++) {
                    that_1.tags.push(confpin.tags[i]);
                }
            }
            if (confpin.cmdopen) {
                that_1.cmdopen = confpin.cmdopen;
            }
            else {
                that_1.cmdopen = function () {
                    return new Promise(function (resolve, reject) {
                        exec('echo 1 > /sys/class/gpio/gpio' + that_1.pin + '/value', function (err, stout, stderr) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                that_1.status = 'open';
                                var a = {
                                    status: that_1.status
                                };
                                if (that_1.serial)
                                    a.serial = that_1.serial;
                                if (that_1.name)
                                    a.name = that_1.name;
                                resolve(a);
                            }
                        });
                    });
                };
            }
            if (confpin.cmdclose) {
                that_1.cmdclose = confpin.cmdclose;
            }
            else {
                that_1.cmdclose = function () {
                    return new Promise(function (resolve, reject) {
                        exec('echo 0 > /sys/class/gpio/gpio' + that_1.pin + '/value', function (err, stout, stderr) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                that_1.status = 'close';
                                var a = {
                                    status: that_1.status
                                };
                                if (that_1.serial)
                                    a.serial = that_1.serial;
                                if (that_1.name)
                                    a.name = that_1.name;
                                resolve(a);
                            }
                        });
                    });
                };
            }
        }
    }
    Relaypin.prototype.switch = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (that.status) {
                that.switchclose().then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    reject(err);
                });
            }
            else {
                that.switchopen().then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    Relaypin.prototype.switchopen = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (that.status === 'close') {
                that.cmdopen().then(function (a) {
                    for (var i = 0; i < that.onopen.length; i++) {
                        that.onopen[i];
                        resolve(a);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    Relaypin.prototype.switchclose = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (that.status === 'close') {
                that.cmdclose().then(function (a) {
                    for (var i = 0; i < that.onclose.length; i++) {
                        that.onclose[i];
                        resolve(a);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    Relaypin.prototype.on = function (value, cmd) {
        if (cmd) {
            if (value === 'close') {
                this.onclose.push(cmd);
            }
            else if (value === 'open') {
                this.onopen.push(cmd);
            }
            else if (value === 'switch') {
                this.switches.push(cmd);
            }
            else {
                throw Error("no pin number provided");
            }
        }
        else {
            throw Error("no pin number provided");
        }
    };
    return Relaypin;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Relaypin;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHO29CQUNsQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2YsQ0FBQyxDQUFDLENBQUE7WUFDTixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBQ0QscUJBQUUsR0FBRixVQUFHLEtBQWlCLEVBQUUsR0FBYTtRQUMvQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQzFCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXpCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRTNCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1lBQ3pDLENBQUM7UUFFTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1FBQ3pDLENBQUM7SUFDTCxDQUFDO0lBQ0wsZUFBQztBQUFELENBekpBLEFBeUpDLElBQUE7QUF6SkQ7MEJBeUpDLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnR5cGUgVHN3aXRjaEFsbCA9IFwib3BlblwiIHwgXCJjbG9zZVwiIHwgXCJzd2l0Y2hcIjtcbnR5cGUgVHN3aXRjID0gXCJvcGVuXCIgfCBcImNsb3NlXCI7XG5cbmludGVyZmFjZSBJUmVsYXlwaW4ge1xuICAgIG5vcm1hbGx5PzogVHN3aXRjO1xuICAgIHBpbjogbnVtYmVyO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgdGFncz86IHN0cmluZ1tdO1xuICAgIHN0YXR1cz86IFRzd2l0YztcbiAgICBjbWRvcGVuPzogKCkgPT4gUHJvbWlzZTxJU3dpdGNoQW5zd2VyPjtcbiAgICBjbWRjbG9zZT86ICgpID0+IFByb21pc2U8SVN3aXRjaEFuc3dlcj47XG4gICAgc2VyaWFsPzogZmFsc2UgfCBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJU3dpdGNoQW5zd2VyIHtcbiAgICBuYW1lPzogc3RyaW5nO1xuICAgIHNlcmlhbD86IHN0cmluZztcbiAgICBzdGF0dXM6IHN0cmluZztcbn1cblxuaW1wb3J0ICogYXMgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuXG5pbXBvcnQgKiBhcyBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuY29uc3QgZXhlYyA9IGNoaWxkX3Byb2Nlc3MuZXhlY1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxheXBpbiBpbXBsZW1lbnRzIElSZWxheXBpbiB7XG4gICAgbm9ybWFsbHk6IFRzd2l0YztcbiAgICBwaW46IG51bWJlcjtcbiAgICBuYW1lPzogc3RyaW5nO1xuICAgIHRhZ3M6IHN0cmluZ1tdID0gW107XG4gICAgc3RhdHVzOiBUc3dpdGM7XG4gICAgY21kb3BlbjogKCkgPT4gUHJvbWlzZTxJU3dpdGNoQW5zd2VyPjtcbiAgICBjbWRjbG9zZTogKCkgPT4gUHJvbWlzZTxJU3dpdGNoQW5zd2VyPjtcbiAgICBzd2l0Y2hlczogRnVuY3Rpb25bXTtcbiAgICBvbm9wZW46IEZ1bmN0aW9uW107XG4gICAgb25jbG9zZTogRnVuY3Rpb25bXTtcbiAgICBzZXJpYWw6IGZhbHNlIHwgc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGNvbmZwaW46IElSZWxheXBpbikge1xuXG4gICAgICAgIGlmICghY29uZnBpbi5waW4gfHwgKGNvbmZwaW4uY21kb3BlbiAmJiBjb25mcGluLmNtZGNsb3NlKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJubyBwaW4gbnVtYmVyIHByb3ZpZGVkXCIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0aGF0ID0gdGhpc1xuICAgICAgICAgICAgaWYgKGNvbmZwaW4ucGluKSB0aGF0LnBpbiA9IGNvbmZwaW4ucGluXG4gICAgICAgICAgICBpZiAoY29uZnBpbi5uYW1lKSB0aGF0Lm5hbWUgPSBjb25mcGluLm5hbWVcbiAgICAgICAgICAgIGlmIChjb25mcGluLnNlcmlhbCkge1xuICAgICAgICAgICAgICAgIHRoYXQuc2VyaWFsID0gY29uZnBpbi5zZXJpYWxcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhhdC5zZXJpYWwgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbmZwaW4uc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5zdGF0dXMgPSBjb25mcGluLnN0YXR1c1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGF0LnN0YXR1cyA9IHRoYXQubm9ybWFsbHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb25mcGluLm5vcm1hbGx5KSB7XG4gICAgICAgICAgICAgICAgdGhhdC5ub3JtYWxseSA9IGNvbmZwaW4ubm9ybWFsbHlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhhdC5ub3JtYWxseSA9IFwib3BlblwiIC8vIGRlZmF1bHQgbm9ybWFsbHlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbmZwaW4udGFncykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZnBpbi50YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudGFncy5wdXNoKGNvbmZwaW4udGFnc1tpXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29uZnBpbi5jbWRvcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5jbWRvcGVuID0gY29uZnBpbi5jbWRvcGVuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoYXQuY21kb3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPElTd2l0Y2hBbnN3ZXI+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWMoJ2VjaG8gMSA+IC9zeXMvY2xhc3MvZ3Bpby9ncGlvJyArIHRoYXQucGluICsgJy92YWx1ZScsIGZ1bmN0aW9uIChlcnIsIHN0b3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zdGF0dXMgPSAnb3BlbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYTogSVN3aXRjaEFuc3dlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogdGhhdC5zdGF0dXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5zZXJpYWwpIGEuc2VyaWFsID0gdGhhdC5zZXJpYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubmFtZSkgYS5uYW1lID0gdGhhdC5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb25mcGluLmNtZGNsb3NlKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5jbWRjbG9zZSA9IGNvbmZwaW4uY21kY2xvc2VcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhhdC5jbWRjbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPElTd2l0Y2hBbnN3ZXI+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWMoJ2VjaG8gMCA+IC9zeXMvY2xhc3MvZ3Bpby9ncGlvJyArIHRoYXQucGluICsgJy92YWx1ZScsIGZ1bmN0aW9uIChlcnIsIHN0b3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zdGF0dXMgPSAnY2xvc2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGE6IElTd2l0Y2hBbnN3ZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHRoYXQuc3RhdHVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuc2VyaWFsKSBhLnNlcmlhbCA9IHRoYXQuc2VyaWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm5hbWUpIGEubmFtZSA9IHRoYXQubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN3aXRjaCgpIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPElTd2l0Y2hBbnN3ZXI+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGlmICh0aGF0LnN0YXR1cykge1xuICAgICAgICAgICAgICAgIHRoYXQuc3dpdGNoY2xvc2UoKS50aGVuKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYSlcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhhdC5zd2l0Y2hvcGVuKCkudGhlbihmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGEpXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHN3aXRjaG9wZW4oKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxJU3dpdGNoQW5zd2VyPihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAodGhhdC5zdGF0dXMgPT09ICdjbG9zZScpIHtcbiAgICAgICAgICAgICAgICB0aGF0LmNtZG9wZW4oKS50aGVuKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5vbm9wZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQub25vcGVuW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgc3dpdGNoY2xvc2UoKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxJU3dpdGNoQW5zd2VyPihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAodGhhdC5zdGF0dXMgPT09ICdjbG9zZScpIHtcbiAgICAgICAgICAgICAgICB0aGF0LmNtZGNsb3NlKCkudGhlbihmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoYXQub25jbG9zZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5vbmNsb3NlW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgb24odmFsdWU6IFRzd2l0Y2hBbGwsIGNtZDogRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKGNtZCkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSAnY2xvc2UnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbmNsb3NlLnB1c2goY21kKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ29wZW4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbm9wZW4ucHVzaChjbWQpXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdzd2l0Y2gnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hlcy5wdXNoKGNtZClcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIm5vIHBpbiBudW1iZXIgcHJvdmlkZWRcIilcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJubyBwaW4gbnVtYmVyIHByb3ZpZGVkXCIpXG4gICAgICAgIH1cbiAgICB9XG59Il19
