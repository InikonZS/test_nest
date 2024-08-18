import React from "react";
import { AvatarEditor } from "./components/avatarEditor/avatarEditor";
import { Sparkle } from "./components/sparkle/sparkle";
import { AniSlider } from "./components/aniSlider/aniSlider";
import { ProCard } from "./components/proCard/proCard";
import { Wheel } from "./components/wheel/wheel";

export function App(){
    return <div>
        <AvatarEditor></AvatarEditor>
        {/*<Sparkle></Sparkle>*/}
        <AniSlider></AniSlider>
        <ProCard></ProCard>
        <Wheel></Wheel>
    </div>
}