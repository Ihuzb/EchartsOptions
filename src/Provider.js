const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let getWebViewContent = async (templatePath) => {
    const resourcePath = path.join(__dirname, templatePath);
    let text = await fs.readFileSync(resourcePath, 'utf8')
    return JSON.parse(text);
}
module.exports = {
    // 树节点
    EntryList: class EntryList {
        refresh() {
            // 更新视图
        }

        getTreeItem(element) {
            return element;
        }

        async getChildren(element) {
            let jsonInfo = await getWebViewContent('../data/general.json');
            let jsonTextInfo = await getWebViewContent('../data/options/general-content.json');
            let EntryItem = vscode.TreeItem;
            class Dependency extends vscode.TreeItem {
                constructor(label, version, collapsibleState) {
                    super(label, collapsibleState);
                    this.tooltip = `${label}-${version}`;
                    this.description = version;
                }
            }

            if (element) {//子节点
                console.log(element);
                let label = element.label, id = element.id, description = element.command.title;
                let childs = [], children = [], isChi = id.indexOf('-') > -1;
                if (isChi) {
                    let childrenArray = id.split('-');
                    childrenArray.forEach((v, i) => {
                        if (i == 0) {
                            children = jsonInfo[i].children;
                        } else {
                            children = children[v].children
                        }
                    });
                    label = description.split('.')[0];
                } else {
                    children = jsonInfo[Number(id)].children;
                }
                let labelInfo = await getWebViewContent(`../data/options/${label}.json`)
                children.forEach((v, index) => {
                    let str = index.toString();
                    let text = v.prop, textKey = '';
                    if (v.children && v.children.length) {
                        let item = new EntryItem(text, vscode.TreeItemCollapsibleState.Collapsed);
                        let objectInfo = `${text}:{\n$0    $1\r},`;
                        item.id = `${id}-${str}`;
                        item.command = {
                            command: "beautifulGirl1.openChild", //命令id
                            title: `${description}.${text}`,
                            arguments: [objectInfo], //命令接收的参数
                        };
                        childs[str] = item;
                    } else {
                        if (isChi) {
                            let label = description.split('.').slice(1).join('.')
                            textKey = `${label}.${text}`
                        }
                        let title = labelInfo[textKey || text] ? labelInfo[textKey || text].desc : '';
                        let item = new Dependency(text, title, vscode.TreeItemCollapsibleState.None);
                        let defaults = text.uiControl ? (text.uiControl.default || '') : '';
                        let objectInfo = `${text}:'${defaults}',\r`;
                        item.command = {
                            command: "beautifulGirl1.openChild", //命令id
                            title: text,
                            arguments: [objectInfo], //命令接收的参数
                        };
                        childs[str] = item;
                    }
                });
                return childs;
            } else { //根节点
                let childs = [];
                for (let index = 0; index < jsonInfo.length; index++) {
                    let name = jsonInfo[index]['prop'];
                    let str = index.toString();
                    let text = jsonTextInfo[name];
                    let title = text ? text.desc : ''
                    let item = new EntryItem(name, vscode.TreeItemCollapsibleState.Collapsed);
                    let objectInfo = `${name}:{\n$0    $1\r},`;
                    item.id = str;
                    item.tooltip = title;
                    item.description = title;
                    item.command = {
                        command: "beautifulGirl1.openChild", //命令id
                        title: name,
                        arguments: [objectInfo], //命令接收的参数
                    };
                    childs[str] = item;
                }
                return childs;
            }
        }
    },
    // 树节点
    examplesEntryList: class EntryList {
        refresh() {
            // 更新视图
        }

        getTreeItem(element) {
            return element;
        }

        async getChildren(element) {
            let jsonInfo = await getWebViewContent('../data/examples.json');
            let EntryItem = vscode.TreeItem;
            class Dependency extends vscode.TreeItem {
                constructor(label, version, collapsibleState) {
                    super(label, collapsibleState);
                    this.tooltip = `${label}-${version}`;
                    this.description = version;
                }
            }
            if (!element) {
                let childs = [], index = 0;
                console.log(jsonInfo)
                for (let key in jsonInfo) {
                    let str = index.toString();
                    let title = jsonInfo[key].desc;
                    let item = new Dependency(key, title, vscode.TreeItemCollapsibleState.None);
                    console.log(JSON.stringify(jsonInfo[key].option))
                    item.command = {
                        command: "beautifulGirl1.openChild", //命令id
                        title: key,
                        arguments: [JSON.stringify(jsonInfo[key].option)], //命令接收的参数
                    };
                    childs[str] = item;
                    index += 1;
                }
                return childs;
            }
        }
    }
}

