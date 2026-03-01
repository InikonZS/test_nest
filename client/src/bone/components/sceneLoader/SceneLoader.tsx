import React from "react";
import './SceneLoader.css';

export const SceneLoader = ({onLoad}: {onLoad:(scene: any, resMap: any)=>void}) => {
    return <div onClick={async () => {
        if (!(('showDirectoryPicker' in window) && typeof window.showDirectoryPicker == 'function')) {
            console.log('Only chrome required');
            return;
        }
        const handler = await window.showDirectoryPicker();
        if(!handler){
            return;
        }

        async function* getFilesRecursively(entry: any, path = "scene"):any {
            //console.log(entry);
            if (entry.kind === "file") {
                const file = await entry.getFile();
                if (file !== null) {
                    file.relativePath = path;//getRelativePath(entry);
                    yield file;
                }
            } else if (entry.kind === "directory") {
                for await (const handle of entry.values()) {
                    yield* getFilesRecursively(handle, path + "/" + handle.name);
                }
            }
        }

        const resMap: Record<string, Blob> = {};
        const scenes: Array<any> = [];

        for await (const fileHandle of getFilesRecursively(handler)) {
            console.log(fileHandle);
            resMap[fileHandle.relativePath] = fileHandle;
            if (fileHandle.name.endsWith('.scene.json')){
                await new Promise((resolve)=>{const reader = new FileReader();
                reader.readAsText(fileHandle);
                reader.onload = ()=>{
                    const scene = JSON.parse(reader.result as string);
                    console.log(scene);
                    scenes.push(scene);
                    resolve(null);
                }});
            }
        }
        onLoad(scenes[0], resMap);
    }}>
        loadScene
    </div>
}