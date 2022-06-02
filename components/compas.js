import * as THREE from "three";
import axios from "axios";


function toThree(content) {

    console.log("toThree", content);

    if (content.dtype === "compas.datastructures/Mesh") {

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

        for (const [_, face] of Object.entries(content.value.face)) {
            if (face.length === 4) {
                vertices.push(content.value.vertex[face[0]]);
                vertices.push(content.value.vertex[face[1]]);
                vertices.push(content.value.vertex[face[2]]);
                vertices.push(content.value.vertex[face[2]]);
                vertices.push(content.value.vertex[face[3]]);
                vertices.push(content.value.vertex[face[0]]);

                pA.copy(content.value.vertex[face[0]]);
                pB.copy(content.value.vertex[face[1]]);
                pC.copy(content.value.vertex[face[2]]);
                pD.copy(content.value.vertex[face[3]]);

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
                vertices.push(content.value.vertex[face[0]]);
                vertices.push(content.value.vertex[face[1]]);
                vertices.push(content.value.vertex[face[2]]);

                pA.copy(content.value.vertex[face[0]]);
                pB.copy(content.value.vertex[face[1]]);
                pC.copy(content.value.vertex[face[2]]);

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
        const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: 0x0092D2, flatShading: false });
        const mesh = new THREE.Mesh(geometry, material);

        lines = lines.flat()
        lines = lines.map(v => [v.x, v.y, v.z]);

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lines.flat()), 3));

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
        mesh.add(lineSegments)

        return mesh;

    }

}


export default async function (url) {
    let response = await axios.get(url);
    return toThree(response.data);
}