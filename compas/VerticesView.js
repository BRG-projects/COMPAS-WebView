import * as THREE from "three";
import AttributesView from "./AttributesView";
import aggregation from "aggregation/es6";
import { vertexShader, fragmentShader } from "../shaders/points";

export default class VerticesView extends aggregation(THREE.Points, AttributesView) {
    constructor(data, settings) {

        let vertices = [];
        let selected = [];
        let vertexIndexMapping = {};
        let vertexKeyMapping = {};

        let i = 0;
        for (const [key, v] of Object.entries(data.value.vertex)) {
            vertices.push([v.x, v.y, v.z]);
            selected.push(0);
            vertexIndexMapping[i] = key
            vertexKeyMapping[key] = i;
            i++;
        }

        let position = new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3);
        selected = new THREE.Int32BufferAttribute(selected, 1);

        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute("position", position);
        pointsGeometry.setAttribute("selected", selected);

        let colorPoints = settings['color.vertices']
        if (colorPoints) {
            colorPoints = new THREE.Color(colorPoints.value.red, colorPoints.value.green, colorPoints.value.blue);
        } else {
            colorPoints = new THREE.Color(0xffffff);
        }

        const pointsMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: colorPoints },
            },
            vertexShader,
            fragmentShader
        });


        super(pointsGeometry, pointsMaterial);

        this.init(data, settings);
        this.vertexIndexMapping = vertexIndexMapping;
        this.vertexKeyMapping = vertexKeyMapping;
        this.colorPoints = colorPoints;
        this.name = "vertices";
        this.visible = false;

    }

    getAttributes() {
        // Get list of attributes to be displayed in scene graph
        const attributes = [];
        for (const key in this.data.value.vertex) {
            attributes.push({
                name: key,
                id: "vertices." + key,
            });
        }
        return attributes;
    }

    setColor(r, g, b) {
        this.colorPoints.setRGB(r, g, b);
        this.geometry.attributes.selected.needsUpdate = true;
    }

    invertColor(isDark) {
        if (this.colorPoints.getHex() === 0xffffff && !isDark) {
            this.colorPoints.set(0x000000);
        } else if (this.colorPoints.getHex() === 0x000000 && isDark) {
            this.colorPoints.set(0xffffff);
        }
        this.geometry.attributes.selected.needsUpdate = true;
    }

    indexToKey(index) {
        // Get attribute key from triangle index
        return this.vertexIndexMapping[index];
    }

    selectAttribute(key) {
        console.log(key)
        this.geometry.attributes.selected.array.fill(0);
        let index = this.vertexKeyMapping[key];
        if (index !== undefined) {
            this.geometry.attributes.selected.array[index] = 1;
        }
        this.geometry.attributes.selected.needsUpdate = true;
    }

    getAttributeProperties(key) {
        // Get attribute properties to be displayed in property form
        let properties = [
            {
                key: "key",
                value: key,
            },
            {
                key: "data",
                value: "vertexdata",
                data: this.data.value.vertex[key],
            },
        ];
        return properties
    }

}