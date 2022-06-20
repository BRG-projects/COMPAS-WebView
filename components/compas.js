import * as THREE from "three";
// import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
// import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
// import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

export default function compasToThree(data, settings = {}) {

    console.log("toThree", data);

    if (data.dtype === "compas.datastructures/Mesh") {

        const mesh = new THREE.Group();
        mesh.type = "Mesh"

        let vertices = [];
        let normals = [];
        let edges = {};
        const triangleFaceMapping = {};
        const compasFaceMapping = {}

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
                  value: "faceAttribute",
                  data: {},
                },
              ];

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
        lineSegments.isAttributes = true;
        lineSegments.lastSelected = null;

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
                  value: index,
                },
                {
                  key: "data",
                  value: "vertexAttribute",
                  data: data.value.vertex[index],
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

export function generateAttributesView(data) {

    const attributeGroup = new THREE.Group();
    const facesGroup = new THREE.Group();
    const edgesGroup = new THREE.Group();
    const verticesGroup = new THREE.Group();
    facesGroup.name = "faces";
    edgesGroup.name = "edges";
    verticesGroup.name = "vertices";

    attributeGroup.add(facesGroup);
    attributeGroup.add(edgesGroup);
    attributeGroup.add(verticesGroup);

    const edges = {};

    let addEdge = (a, b) => {
        let key1 = [a + "," + b];
        let key2 = [b + "," + a];
        if (!edges[key1] && !edges[key2]) {
            edges[key1] = [a, b];
        }
    }


    for (const [key, face] of Object.entries(data.value.face)) {

        let vertices = [];
        let normals = [];
        let lines = [];

        const pA = new THREE.Vector3(),
            pB = new THREE.Vector3(),
            pC = new THREE.Vector3(),
            pD = new THREE.Vector3();

        const cb = new THREE.Vector3(),
            ab = new THREE.Vector3(),
            cd = new THREE.Vector3(),
            ad = new THREE.Vector3();


        if (face.length === 4) {
            vertices.push(data.value.vertex[face[0]]);
            vertices.push(data.value.vertex[face[1]]);
            vertices.push(data.value.vertex[face[2]]);
            vertices.push(data.value.vertex[face[2]]);
            vertices.push(data.value.vertex[face[3]]);
            vertices.push(data.value.vertex[face[0]]);

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

            addEdge(face[0], face[1]);
            addEdge(face[1], face[2]);
            addEdge(face[2], face[3]);
            addEdge(face[3], face[0]);

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
            addEdge(face[2], face[3]);

        }

        vertices = vertices.map(v => [v.x, v.y, v.z]);
        normals = normals.map(n => [n.x, n.y, n.z]);

        let position = new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3);
        let normal = new THREE.BufferAttribute(new Float32Array(normals.flat()), 3);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", position);
        geometry.setAttribute("normal", normal);
        const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: 0x0092D2, flatShading: false });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.name = key;

        facesGroup.add(mesh);
    }

    for (let [key, vertices] of Object.entries(edges)) {
        vertices = vertices.map(v => data.value.vertex[v]);
        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        const line = new THREE.Line(geometry, material);
        line.name = key;
        edgesGroup.add(line);
    }

    for (const [key, v] of Object.entries(data.value.vertex)) {

        let position = new THREE.BufferAttribute(new Float32Array([v.x, v.y, v.z]), 3);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", position);

        const material = new THREE.PointsMaterial({ size: 0.2, color: 0xffffff });
        const vertex = new THREE.Points(geometry, material);
        vertex.name = key;

        verticesGroup.add(vertex);
    }



    return attributeGroup;

}

const vertexShader = `
attribute int selected;
flat varying int vSelected;

void main() {

    vSelected = selected;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    if (selected == 1) {
        gl_PointSize = 20.0;
    }else{
        gl_PointSize = 10.0;
    }

    gl_Position = projectionMatrix * mvPosition;

}
`

const fragmentShader = `
uniform vec3 color;
flat varying int vSelected;

void main() {

    if (vSelected == 1) {
        gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );
    }else{
        gl_FragColor = vec4( color, 1.0 );
    }

    if ( pow(gl_PointCoord.x - 0.5, 2.0) + pow(gl_PointCoord.y - 0.5, 2.0) > 0.25 ) discard;

}
`