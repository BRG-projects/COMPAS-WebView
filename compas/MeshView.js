import * as THREE from "three";
import FacesView from "./FacesView";
import EdgesView from "./EdgesView";
import VerticesView from "./VerticesView";

export default class MeshView extends THREE.Group {
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
        this.faces = new FacesView(this.data, this.settings);
        this.edges = new EdgesView(this.data, this.settings);
        this.vertices = new VerticesView(this.data, this.settings);
        this.add(this.faces);
        this.add(this.edges);
        this.add(this.vertices);
    }

    calculateRaycastThreshold() {
        this.raycastThreshold = 0.01;
        this.children.forEach(child => {
            if (child.raycastThreshold)
                this.raycastThreshold = child.raycastThreshold;
        })

    }

    updateFromSettings() {
        const { settings } = this;
        if (settings['color.faces']){
            this.faces.setColor(settings['color.faces'].value.red, settings['color.faces'].value.green, settings['color.faces'].value.blue);
        }
        if (settings['color.edges']) {
            this.edges.setColor(settings['color.edges'].value.red, settings['color.edges'].value.green, settings['color.edges'].value.blue);
        }
        if (settings['color.vertices']) {
            this.vertices.setColor(settings['color.vertices'].value.red, settings['color.vertices'].value.green, settings['color.vertices'].value.blue);
        }
    }

}

