/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function handleOpenURL(url) {
    setTimeout(function() {
        console.log(`TestApp, handleOpenURL: initiate Adjust.appWillOpenUrl, with URL = ${url}`);
        Adjust.appWillOpenUrl(url);
    }, 0);
}

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        // Register for universal links
        if (device.platform == 'iOS') {
            universalLinks.subscribe('adjustDeepLinking', app.didLaunchAppFromLink);
        }

        var baseUrl = "";
        var gdprUrl = "";
        if (device.platform === "Android") {
            baseUrl = "https://10.0.2.2:8443";
            gdprUrl = "https://10.0.2.2:8443";
        } else if (device.platform === "iOS") {
            baseUrl = "http://127.0.0.1:8080";
            gdprUrl = "http://127.0.0.1:8080";
        }

        var commandExecutor = new CommandExecutor(baseUrl, gdprUrl);
        AdjustTesting.addTest("current/gdpr/Test_GdprForgetMe_after_install");
        // AdjustTesting.addTestDirectory("current/gdpr");
        
        AdjustTesting.startTestSession(baseUrl, function(json) {
            var commandDict = JSON.parse(json);
            var className = commandDict['className'];
            var functionName = commandDict['functionName'];
            var params = commandDict['params'];
            var order = commandDict['order'];

            commandExecutor.scheduleCommand(className, functionName, params, order);
        });
    },

    didLaunchAppFromLink: function(eventData) {
        console.log(`TestApp, didLaunchAppFromLink: initiate Adjust.appWillOpenUrl, with URL = ${eventData.url}`);
        Adjust.appWillOpenUrl(eventData.url);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
