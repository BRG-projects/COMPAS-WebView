import * as THREE from "three";
import AttributesView from "./AttributesView";
import aggregation from "aggregation/es6";

export default class EdgesView extends aggregation(THREE.LineSegments, AttributesView) {
    constructor(data, settings) {

        let edges = {};

        let addEdge = (a, b) => {
            let key1 = [a + "," + b];
            let key2 = [b + "," + a];
            if (!edges[key1] && !edges[key2]) {
                edges[key1] = [a, b];
            }
        }

        for (const [key, face] of Object.entries(data.value.face)) {
            if (face.length === 4) {
                addEdge(face[0], face[1]);
                addEdge(face[1], face[2]);
                addEdge(face[2], face[3]);
                addEdge(face[3], face[0]);
            } else if (face.length === 3) {
                addEdge(face[0], face[1]);
                addEdge(face[1], face[2]);
                addEdge(face[2], face[0]);
            }
        }

        let colorEdges = settings['color.edges']
        if (colorEdges) {
            colorEdges = new THREE.Color(colorEdges.value.red, colorEdges.value.green, colorEdges.value.blue);
        } else {
            colorEdges = new THREE.Color(0xffffff);
        }

        let lines = [];
        let avgLineLength = 0;
        let edgesIndexMapping = {};
        let edgesKeyMapping = {};
        let edgeIndex = 0;
        for (let [key, line] of Object.entries(edges)) {

            edgesIndexMapping[key] = edgeIndex;
            edgesKeyMapping[edgeIndex] = key;
            edgeIndex += 2;

            lines.push(data.value.vertex[line[0]], data.value.vertex[line[1]]);
            avgLineLength += new THREE.Vector3().subVectors(data.value.vertex[line[0]], data.value.vertex[line[1]]).length();
        }

        avgLineLength /= lines.length;

        lines = lines.map(v => [v.x, v.y, v.z]);
        let vertexColors = lines.map(v => [colorEdges.r, colorEdges.g, colorEdges.b]);

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lines.flat()), 3));
        lineGeometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(vertexColors.flat()), 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true });
        super(lineGeometry, lineMaterial);

        this.init(data, settings);
        this.edges = edges;
        this.edgesIndexMapping = edgesIndexMapping;
        this.edgesKeyMapping = edgesKeyMapping;
        this.colorEdges = colorEdges;
        this.name = "edges";
        this.visible = false;
        this.raycastThreshold = avgLineLength / 5;

    }

    getAttributes() {
        // Get list of attributes to be displayed in scene graph
        const attributes = [];
        for (const key in this.edges) {
            attributes.push({
                name: key,
                id: "edges." + key,
            });
        }
        return attributes;
    }

    setColor(r, g, b) {
        for (let i = 0; i < this.geometry.attributes.color.array.length; i += 3) {
            this.geometry.attributes.color.array[i] = r;
            this.geometry.attributes.color.array[i + 1] = g;
            this.geometry.attributes.color.array[i + 2] = b;
        }
        this.geometry.attributes.color.needsUpdate = true;
    }

    invertColor(isDark) {
        if (this.colorEdges.getHex() === 0xffffff && !isDark) {
            this.colorEdges.set(0x000000);
        } else if (this.colorEdges.getHex() === 0x000000 && isDark) {
            this.colorEdges.set(0xffffff);
        }
        this.setColor(this.colorEdges.r, this.colorEdges.g, this.colorEdges.b);
    }

    indexToKey(index) {
        // Get attribute key from triangle index
        return this.edgesKeyMapping[index];
    }

    selectAttribute(key) {
        let changeColor = (key, r, g, b) => {
            const index = this.edgesIndexMapping[key];
            this.geometry.attributes.color.array[index * 3] = r;
            this.geometry.attributes.color.array[index * 3 + 1] = g;
            this.geometry.attributes.color.array[index * 3 + 2] = b;
            this.geometry.attributes.color.array[index * 3 + 3] = r;
            this.geometry.attributes.color.array[index * 3 + 4] = g;
            this.geometry.attributes.color.array[index * 3 + 5] = b;
        }

        if (this.lastSelected !== null) {
            changeColor(this.lastSelected, this.colorEdges.r, this.colorEdges.g, this.colorEdges.b);
        }

        if (key !== null) changeColor(key, 1, 1, 0);
        this.lastSelected = key;
        this.geometry.attributes.color.needsUpdate = true;
    }

    getAttributeProperties(key) {
        // Get attribute properties to be displayed in property form
        let properties = [
            {
                key: "key",
                value: key,
            }
        ];
        if (this.data.value.edgedata) {
            properties.push({
                key: "data",
                value: "edgedata",
                data: this.data.value.edgedata[key],
            })
        }
        return properties
    }

}