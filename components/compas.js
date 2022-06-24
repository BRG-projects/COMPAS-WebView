import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/points";
// import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
// import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
// import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

export default function compasToThree(data, settings = {}) {

    console.log("toThree", data, settings);

    if (data.dtype === "compas.datastructures/Mesh") {

        const mesh = new THREE.Group();
        mesh.type = data.dtype;
        mesh.guid = data.guid;
        mesh.name = data.value.name
        mesh.settings = settings;

        let vertices = [];
        let normals = [];
        let edges = {};
        const triangleFaceMapping = {};
        const compasFaceMapping = {};
        const vertexMapping = {};

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

        let addEdge = (a, b) => {
            let key1 = [a + "," + b];
            let key2 = [b + "," + a];
            if (!edges[key1] && !edges[key2]) {
                edges[key1] = [a, b];
            }
        }

        let triangleIndex = 0;
        
        let vertexKeys = Object.keys(data.value.vertex)
        for (let i = 0; i< vertexKeys.length; i++) {
            vertexMapping[i] = vertexKeys[i]
        }

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

                addEdge(face[0], face[1]);
                addEdge(face[1], face[2]);
                addEdge(face[2], face[3]);
                addEdge(face[3], face[0]);

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

                addEdge(face[0], face[1]);
                addEdge(face[1], face[2]);
                addEdge(face[2], face[0]);

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
        const faces = new THREE.Mesh(geometry, material);
        faces.name = "faces";
        faces.isAttributes = true;
        faces.lastSelected = null;

        faces.selectAttribute = (index) => {
            let changeColor = (index, r, g, b) => {
                const compasFaceIndex = triangleFaceMapping[index];
                const triangleFaceIndexes = compasFaceMapping[compasFaceIndex];
                triangleFaceIndexes.forEach(ti => {
                    for (let vi = 0; vi < 3; vi++) {
                        faces.geometry.attributes.color.array[ti * 9 + vi * 3] = r;
                        faces.geometry.attributes.color.array[ti * 9 + vi * 3 + 1] = g;
                        faces.geometry.attributes.color.array[ti * 9 + vi * 3 + 2] = b;
                    }
                })
            }

            if (faces.lastSelected !== null) {
                changeColor(faces.lastSelected, colorFaces.r, colorFaces.g, colorFaces.b);
            }

            if (index >= 0) {
                changeColor(index, 1, 1, 0);
                faces.lastSelected = index;
            } else {
                faces.lastSelected = null;
            }
            faces.geometry.attributes.color.needsUpdate = true;

            let properties = [
                {
                  key: "key",
                  value: triangleFaceMapping[index],
                },
                {
                  key: "data",
                  value: "facedata",
                  data: data.value.facedata[triangleFaceMapping[index]],
                },
              ];

              console.log(data)

            return properties
        }

        mesh.add(faces);


        let colorEdges = settings['color.edges']
        if (colorEdges) {
            colorEdges = new THREE.Color(colorEdges.value.red, colorEdges.value.green, colorEdges.value.blue);
        } else {
            colorEdges = new THREE.Color(0xffffff);
        }

        // lines = lines.flat()
        let lines = [];
        let avgLineLength = 0;
        for (let [_, line] of Object.entries(edges)) {
            lines.push(data.value.vertex[line[0]], data.value.vertex[line[1]]);
            avgLineLength += new THREE.Vector3().subVectors(data.value.vertex[line[0]], data.value.vertex[line[1]]).length();
        }
        avgLineLength /= lines.length;
        mesh.raycastThreshold = avgLineLength / 5;

        lines = lines.map(v => [v.x, v.y, v.z]);
        let vertexColors = lines.map(v => [colorEdges.r, colorEdges.g, colorEdges.b]);

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lines.flat()), 3));
        lineGeometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(vertexColors.flat()), 3));

        // const lineGeometry = new LineSegmentsGeometry();
        // lineGeometry.setPositions(lines.flat());
        // lineGeometry.setColors(vertexColors.flat());


        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true });
        // const lineMaterial = new LineMaterial({ color: 0xffffff, linewidth: 0.002,  worldUnits: false, vertexColors: true});

        // const lineSegments = new LineSegments2(lineGeometry, lineMaterial);
        // lineSegments.computeLineDistances()
        const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
        lineSegments.name = "edges";
        lineSegments.visible = false;
        lineSegments.isAttributes = true;
        lineSegments.lastSelected = null;
        lineSegments.invertColor = (isDark) =>{
            if (colorEdges.getHex() === 0xffffff && !isDark) {
                colorEdges.set(0x000000);
            }else if(colorEdges.getHex() === 0x000000 && isDark){
                colorEdges.set(0xffffff);
            }
            for(let i = 0; i < lineSegments.geometry.attributes.color.array.length; i+=3){
                lineSegments.geometry.attributes.color.array[i] = colorEdges.r;
                lineSegments.geometry.attributes.color.array[i+1] = colorEdges.g;
                lineSegments.geometry.attributes.color.array[i+2] = colorEdges.b;
            }
            lineSegments.geometry.attributes.color.needsUpdate = true;
        }
        lineSegments.selectAttribute = (index) => {

            let changeColor = (index, r, g, b) => {
                lineSegments.geometry.attributes.color.array[index * 3] = r;
                lineSegments.geometry.attributes.color.array[index * 3 + 1] = g;
                lineSegments.geometry.attributes.color.array[index * 3 + 2] = b;
                lineSegments.geometry.attributes.color.array[index * 3 + 3] = r;
                lineSegments.geometry.attributes.color.array[index * 3 + 4] = g;
                lineSegments.geometry.attributes.color.array[index * 3 + 5] = b;
            }

            if (lineSegments.lastSelected !== null) {
                changeColor(lineSegments.lastSelected, colorEdges.r, colorEdges.g, colorEdges.b);
            }

            if (index >= 0) {
                changeColor(index, 1, 1, 0);
                lineSegments.lastSelected = index;
            } else {
                lineSegments.lastSelected = null;
            }

            lineSegments.geometry.attributes.color.needsUpdate = true;


        }

        mesh.add(lineSegments)

        vertices = [];
        let selected = [];
        colors = [];
        for (const [_, v] of Object.entries(data.value.vertex)) {
            vertices.push([v.x, v.y, v.z]);
            selected.push(0);
            colors.push([1, 0, 0]);
        }

        position = new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3);
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

        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        points.name = "vertices";
        points.isAttributes = true;
        points.lastSelected = null;

        points.invertColor = (isDark) =>{
            if (colorPoints.getHex() === 0xffffff && !isDark) {
                colorPoints.set(0x000000);
            }else if(colorPoints.getHex() === 0x000000 && isDark){
                colorPoints.set(0xffffff);
            }
        }

        points.selectAttribute = (index) => {
            points.geometry.attributes.selected.array.fill(0);
            if (index >= 0) {
                points.geometry.attributes.selected.array[index] = 1;
                points.lastSelected = index;
            } else {
                points.lastSelected = null;
            }
            points.geometry.attributes.selected.needsUpdate = true;

            let properties = [
                {
                  key: "key",
                  value: vertexMapping[index],
                },
                {
                  key: "data",
                  value: "vertexdata",
                  data: data.value.vertex[vertexMapping[index]],
                },
              ];

            return properties
        }
        points.visible = false;

        mesh.add(points);
        mesh.data = data;
        return mesh;

    }

}