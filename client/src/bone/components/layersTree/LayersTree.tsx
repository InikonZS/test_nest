import React, { useEffect, useState } from "react";
import "./LayersTree.css";

export const LayersTree = ({ model, onChange, selected, setSelected }: { model: any, onChange: (model: any) => void, setSelected: React.Dispatch<React.SetStateAction<any[]>>, selected: Array<any> }) => {
    return <div className="boneLayersTree">
        {
            model.objects.map((objData: any, i: number) => {
                return <div className="boneLayersTreeItem">
                    <div className={`boneLayersTreeItemName ${(selected.find(it=>it.name == objData.name)) ? "boneLayersTreeItemNameSelected" : ""}`} onClick={(e)=>{
                        setSelected(last=>{
                            const nextSelected = e.ctrlKey ? [...last] : [];
                            const selectedIndex = nextSelected.findIndex(it=>it.name == objData.name);
                            if (selectedIndex == -1){
                                nextSelected.push(objData);
                            } else {
                                nextSelected.splice(selectedIndex, 1);
                            }
                            return nextSelected;
                        })
                    }}>
                        <input type="checkbox" onChange={(e) => {
                            const nextModel = { ...model };
                            nextModel.objects[i] = { ...nextModel.objects[i], visible: e.target.checked }
                            onChange(nextModel);
                        }} checked={objData.visible ?? true} />{objData.name}
                    </div>
                    {objData.objects &&
                        <LayersTree model={objData} onChange={(data) => {
                            const nextModel = { ...model };
                            nextModel.objects[i] = data;
                            onChange(nextModel);
                        }} selected={selected} setSelected={setSelected}></LayersTree>
                    }
                </div>
            }
            )
        }
    </div>
}

const recursiveRemove = ( model: any, selected: Array<any>)=>{
    const nextModel = model;//{...model};
    nextModel.objects = nextModel.objects.filter((it: any)=>selected.findIndex(jt=>jt.name == it.name) == -1);
    nextModel.objects.forEach((it: any)=>{
        if (it.objects){
            it = recursiveRemove(it, selected);
        }
    });
    return nextModel;
}

const findParent = (model: any, object: any) => {
    let found: any = null;

    const findRecursive = (item: any, parent: any) => {

        if (item.name === object.name) {
            found = parent;
            return true;
        }

        if (item.objects) {
            return item.objects.some((it: any) => 
                findRecursive(it, item)
            );
        }

        return false;
    };

    findRecursive(model, null);

    return found;
};

function filterTopLevel(root: any, selected: any[]) {
  return selected.filter(obj => {
    let p = findParent(root, obj);
    while (p) {
      if (selected.includes(p)) return false;
      p = findParent(root, p);
    }
    return true;
  });
}

const groupItems = ( model: any, selected: Array<any>) => {
    if (!selected.length){
        return
    }
    selected = filterTopLevel(model, selected);
    const parent = findParent(model, selected[selected.length -1]);
    const elementIndex = parent.objects.findIndex((it:any)=>it.name == selected[selected.length -1].name);
    let upperIndex = elementIndex;
    for (let i = elementIndex; i >= 0; i--){
        if (selected.findIndex((it:any)=>it.name == parent.objects[i]?.name) != -1){
            upperIndex = i;
        } else {
            break
        }
        console.log(upperIndex);
    }
    const upperElement = parent.objects[upperIndex -1]; 
    recursiveRemove( model, selected);
    const insertIndex = parent.objects.findIndex((it:any)=>it.name == upperElement?.name) + 1;
    console.log('ins', insertIndex)
    const nextObjects = parent.objects;//[...parent.objects];
    /*nextObjects.push({
        name: Math.random().toString(),
        position: {x: 0, y: 0},
        objects: selected
    });*/
    nextObjects.splice(insertIndex, 0, {
        name: Math.random().toString(),
        position: {x: 0, y: 0},
        objects: selected
    });
    //console.log(nextObjects)
}

export const LayersTreeEditor = ({ model, onChange }: { model: any, onChange: (model: any) => void }) => {
    const [selected, setSelected] = useState<Array<any>>([]);
    return <div className="boneLayersTreeEditor">
        <div className="boneLayersTreeEditorHead">
            <div onClick={()=>{
                onChange((last: any)=>{
                    const nextModel = {...last};
                    /*nextModel.objects = nextModel.objects.filter((it: any)=>selected.findIndex(jt=>jt.name == it.name) == -1);
                    nextModel.objects.push({
                        name: '',
                        position: {x: 0, y: 0},
                        objects: selected
                    });
                    return nextModel;*/
                    groupItems(nextModel, selected);
                    return nextModel;
                });
            }}>group</div>
        </div>
        <LayersTree model={model} onChange={onChange} selected={selected} setSelected={setSelected}></LayersTree>
    </div>
}