import * as THREE from "three";
import AttributesView from "./AttributesView";
import aggregation from "aggregation/es6";

export default class FacesView extends aggregation(THREE.Mesh, AttributesView) {
    constructor(data, settings) {

        let vertices = [];
        let normals = [];

        const triangleFaceMapping = {};
        const compasFaceMapping = {};
        let triangleIndex = 0;

        const pA = new THREE.Vector3(),
            pB = new THREE.Vector3(),
            pC = new THREE.Vector3(),
            pD = new THREE.Vector3();

        const cb = new THREE.Vector3(),
            ab = new THREE.Vector3(),
            cd = new THREE.Vector3(),
            ad = new THREE.Vector3(),
            ac = new THREE.Vector3(),
            bd = new THREE.Vector3();

        for (const [key, face] of Object.entries(data.value.face)) {
            if (face.length === 4) {
                pA.copy(data.value.vertex[face[0]]);
                pB.copy(data.value.vertex[face[1]]);
                pC.copy(data.value.vertex[face[2]]);
                pD.copy(data.value.vertex[face[3]]);

                cb.subVectors(pC, pB);
                ab.subVectors(pA, pB);
                cb.cross(ab);

                cd.subVectors(pD, pC);
                ad.subVectors(pA, pC);
                cd.cross(ad);

                cb.add(cd);
                cb.normalize();

                for (let i = 0; i < 6; i++) normals.push(cb.clone());

                ac.subVectors(pA, pC);
                bd.subVectors(pB, pD);

                if (ac.lengthSq() < bd.lengthSq()) {
                    vertices.push(data.value.vertex[face[0]]);
                    vertices.push(data.value.vertex[face[1]]);
                    vertices.push(data.value.vertex[face[2]]);
                    vertices.push(data.value.vertex[face[2]]);
                    vertices.push(data.value.vertex[face[3]]);
                    vertices.push(data.value.vertex[face[0]]);
                } else {
                    vertices.push(data.value.vertex[face[3]]);
                    vertices.push(data.value.vertex[face[0]]);
                    vertices.push(data.value.vertex[face[1]]);
                    vertices.push(data.value.vertex[face[1]]);
                    vertices.push(data.value.vertex[face[2]]);
                    vertices.push(data.value.vertex[face[3]]);
                }

                compasFaceMapping[key] = [triangleIndex, triangleIndex + 1]
                triangleFaceMapping[triangleIndex] = key
                triangleFaceMapping[triangleIndex + 1] = key
                triangleIndex += 2;

            } else if (face.length === 3) {
                vertices.push(data.value.vertex[face[0]]);
                vertices.push(data.value.vertex[face[1]]);
                vertices.push(data.value.vertex[face[2]]);

                pA.copy(data.value.vertex[face[0]]);
                pB.copy(data.value.vertex[face[1]]);
                pC.copy(data.value.vertex[face[2]]);

                cb.subVectors(pC, pB);
                ab.subVectors(pA, pB);
                cb.cross(ab);
                cb.normalize();

                for (let i = 0; i < 3; i++) normals.push(cb.clone());

                compasFaceMapping[key] = [triangleIndex]
                triangleFaceMapping[triangleIndex] = key
                triangleIndex += 1;

            }
        }


        let colorFaces = settings['color.faces']
        if (colorFaces) {
            colorFaces = new THREE.Color(colorFaces.value.red, colorFaces.value.green, colorFaces.value.blue);
        } else {
            colorFaces = new THREE.Color(0x0092D2);
        }

        vertices = vertices.map(v => [v.x, v.y, v.z]);
        normals = normals.map(n => [n.x, n.y, n.z]);
        let colors = vertices.map(v => [colorFaces.r, colorFaces.g, colorFaces.b]);

        let position = new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3);
        let normal = new THREE.BufferAttribute(new Float32Array(normals.flat()), 3);
        let color = new THREE.BufferAttribute(new Float32Array(colors.flat()), 3);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", position);
        geometry.setAttribute("normal", normal);
        geometry.setAttribute("color", color);

        const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: 0xffffff, flatShading: false, vertexColors: true });

        super(geometry, material);

        this.data = data;
        this.settings = settings;
        this.triangleFaceMapping = triangleFaceMapping;
        this.compasFaceMapping = compasFaceMapping;
        this.colorFaces = colorFaces;

        this.name = "faces";
        this.isAttributes = true;
        this.lastSelected = null;

    }

    getAttributes() {
        // Get list of attributes to be displayed in scene graph
        const attributes = [];
        for (const key in this.data.value.face) {
            attributes.push({
                name: key,
                id: "faces." + key,
            });
        }
        return attributes;
    }

    setColor(r, g, b) {
        for (let i = 0; i < this.geometry.attributes.color.count; i++) {
            this.geometry.attributes.color.setXYZ(i, r, g, b);
        }
        this.geometry.attributes.color.needsUpdate = true;
    }

    indexToKey(index) {
        // Get attribute key from triangle index
        return this.triangleFaceMapping[index];
    }

    selectAttribute(key) {
        let changeColor = (key, r, g, b) => {
            const triangleFaceIndexes = this.compasFaceMapping[key];
            triangleFaceIndexes.forEach(ti => {
                for (let vi = 0; vi < 3; vi++) {
                    this.geometry.attributes.color.array[ti * 9 + vi * 3] = r;
                    this.geometry.attributes.color.array[ti * 9 + vi * 3 + 1] = g;
                    this.geometry.attributes.color.array[ti * 9 + vi * 3 + 2] = b;
                }
            })
        }

        if (this.lastSelected !== undefined && this.lastSelected !== null) {
            changeColor(this.lastSelected, this.colorFaces.r, this.colorFaces.g, this.colorFaces.b);
        }

        if (key) changeColor(key, 1, 1, 0);
        this.lastSelected = key;
        this.geometry.attributes.color.needsUpdate = true;
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
                value: "facedata",
                data: this.data.value.facedata[key],
            },
        ];
        return properties
    }

}