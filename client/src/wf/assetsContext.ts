import React from "react";
import { IAssets } from "./assetsLoader";

export const AssetsContext = React.createContext<{assets: IAssets}>({ assets: {}});