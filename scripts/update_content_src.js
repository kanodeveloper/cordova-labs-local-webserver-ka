#!/usr/bin/env node

/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

// This script modifies the project root's config.xml
// The <content> tag "src" attribute is modified to point to http://localhost:0

var fs = require('fs');
var path = require('path');
var et = require('elementtree');

module.exports = function(context) {
    var config_xml = path.join(context.opts.projectRoot, 'config.xml');
    var data = fs.readFileSync(config_xml).toString();
    var etree = et.parse(data);
    var content_src = 'html';

    var platform_src = (context.opts.platforms.indexOf('android') < 0) ? "IOS_CONTENT_SRC" : "ANDROID_CONTENT_SRC";

    var value = data.match(new RegExp('name="' + platform_src + '" value="(.*?)"', "i"));
    if(value && value[1]) {
        content_src = value[1];
    }

    var content_tags = etree.findall('./content[@src]');
    if (content_tags.length > 0) {
        content_tags[0].set('src', content_src);
    }

    data = etree.write({'indent': 4});
    fs.writeFileSync(config_xml, data);
}
