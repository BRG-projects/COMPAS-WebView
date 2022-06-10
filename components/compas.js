import * as THREE from "three";

export default function compasToThree(data, settings = {}) {

    console.log("toThree", data);

    if (data.dtype === "compas.datastructures/Mesh") {

        const mesh = new THREE.Group();
        mesh.type = "Mesh"

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

        for (const [_, face] of Object.entries(data.value.face)) {
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

                lines.push([pA.clone(), pB.clone()]);
                lines.push([pB.clone(), pC.clone()]);
                lines.push([pC.clone(), pD.clone()]);
                lines.push([pD.clone(), pA.clone()]);

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

                lines.push([pA.clone(), pB.clone()]);
                lines.push([pB.clone(), pC.clone()]);
                lines.push([pC.clone(), pD.clone()]);

            }
        }

        vertices = vertices.map(v => [v.x, v.y, v.z]);
        normals = normals.map(n => [n.x, n.y, n.z]);

        let position = new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3);
        let normal = new THREE.BufferAttribute(new Float32Array(normals.flat()), 3);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", position);
        geometry.setAttribute("normal", normal);

        let colorFaces = settings['color.faces']
        if (colorFaces) {
            colorFaces = new THREE.Color(colorFaces.value.red, colorFaces.value.green, colorFaces.value.blue);
        } else {
            colorFaces = new THREE.Color(0x0092D2);
        }

        const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: colorFaces, flatShading: false });
        const faces = new THREE.Mesh(geometry, material);
        faces.name = "faces";

        mesh.add(faces);

        lines = lines.flat()
        lines = lines.map(v => [v.x, v.y, v.z]);

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lines.flat()), 3));

        let colorEdges = settings['color.edges']
        if (colorEdges) {
            colorEdges = new THREE.Color(colorEdges.value.red, colorEdges.value.green, colorEdges.value.blue);
        } else {
            colorEdges = new THREE.Color(0xffffff);
        }

        const lineMaterial = new THREE.LineBasicMaterial({ color: colorEdges });
        const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
        lineSegments.name = "edges";
        mesh.add(lineSegments)

        vertices = [];
        const sizes = [];
        const colors = [];
        for (const [_, v] of Object.entries(data.value.vertex)) {
            vertices.push([v.x, v.y, v.z]);
            sizes.push(10);
            colors.push([1, 0 , 0]);
        }

        position = new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3);

        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute("position", position);
        // geometry.setAttribute( 'customColor', new THREE.Float32BufferAttribute( colors.flat(), 3 ) );
        pointsGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ) );

        let colorPoints = settings['color.vertices']
        if (colorPoints) {
            colorPoints = new THREE.Color(colorPoints.value.red, colorPoints.value.green, colorPoints.value.blue);
        } else {
            colorPoints = new THREE.Color(0xffffff);
        }

        const pointsMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: colorPoints },
                size: { value: 15 },
            },
            vertexShader,
            fragmentShader
        });

        // const pointsMaterial = new THREE.PointsMaterial({ size: 0.2, color: 0xffffff });
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        points.name = "vertices";

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
uniform float size;
// attribute vec3 customColor;
// varying vec3 vColor;

void main() {

    // vColor = customColor;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    // gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_PointSize = size;

    gl_Position = projectionMatrix * mvPosition;

}
`

const fragmentShader = `
// uniform vec3 color;
//uniform sampler2D pointTexture;
//uniform float alphaTest;

//varying vec3 vColor;

void main() {

    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );

    //gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

    if ( pow(gl_PointCoord.x - 0.5, 2.0) + pow(gl_PointCoord.y - 0.5, 2.0) > 0.25 ) discard;

}
`