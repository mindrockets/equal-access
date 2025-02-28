import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

function processDir(dir) {
    let retVal = []
    let files = readdirSync(dir);
    for (const file of files) {
        if (file === "." || file === ".." || file === "index.ts") continue;
        if (statSync(join(dir, file)).isDirectory()) {
            let subFiles = processDir(join(dir, file));
            retVal = retVal.concat(subFiles.map(subfile => `${file}/${subfile}`));
        } else if (file.endsWith(".ts")) {
            retVal.push(file.replace(/.ts$/, ""));
        }
    }
    return retVal;
}
(async () => {
    let allFiles = processDir(join(__dirname, "v4", "rules"));
    allFiles.sort((a: string,b: string) => a.localeCompare(b));
    allFiles = allFiles.map(file => `export * from "./${file}"`);
    let genIndex = `/******************************************************************************
  Copyright:: 2022- IBM, Inc
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*****************************************************************************/

// This file is automatically generated by "npm run prebuild". Do not edit

${allFiles.join("\n")}`;
    writeFileSync(join(__dirname,"v4","rules","index.ts"), genIndex);
})()