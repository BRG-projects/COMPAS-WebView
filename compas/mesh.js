import * as THREE from "three";
import FacesView from "./FacesView";
import VerticesView from "./VerticesView";

export class MeshView extends THREE.Group {
    constructor(data, settings) {
        super();
        this.type = data.dtype;
        this.guid = data.guid;
        this.name = data.value.name

        this.data = data;
        this.settings = settings;

        this.setupAttributes();
        this.calculateRaycastThreshold();
    }

    setupAttributes() {
        this.add(new FacesView(this.data, this.settings));
        this.add(new VerticesView(this.data, this.settings));
    }

    calculateRaycastThreshold() {
        this.raycastThreshold = 0.01;
    }

}

