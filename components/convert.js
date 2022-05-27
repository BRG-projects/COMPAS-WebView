import * as THREE from "three";


function calcNormal(normals, normal, angle) {
    let allowed = normals.filter(n => n.angleTo(normal) < angle * Math.PI / 180);
    return allowed.reduce((a, b) => a.clone().add(b)).normalize();
}

export default function (angle) {

    angle = angle || 15;

    const index = this.index;
    const positionAttribute = this.getAttribute("position");

    let pA = new THREE.Vector3(),
        pB = new THREE.Vector3(),
        pC = new THREE.Vector3();

    let nA = new THREE.Vector3(),
        nB = new THREE.Vector3(),
        nC = new THREE.Vector3();
    let cb = new THREE.Vector3(),
        ab = new THREE.Vector3(); // indexed elements

    if (this.index) {

        const flattenPositisionAttribute = new THREE.BufferAttribute(new Float32Array(this.index.count * 3 * 3), 3);
        const normalAttribute = new THREE.BufferAttribute(
            new Float32Array(flattenPositisionAttribute.count * 3),
            3
        );

        const vertexNormals = Array(positionAttribute.count).fill().map(() => []);
        const faces = [];

        for (let i = 0, il = index.count; i < il; i += 3) {
            const vA = index.getX(i + 0);
            const vB = index.getX(i + 1);
            const vC = index.getX(i + 2);

            pA.fromBufferAttribute(positionAttribute, vA);
            pB.fromBufferAttribute(positionAttribute, vB);
            pC.fromBufferAttribute(positionAttribute, vC);

            flattenPositisionAttribute.setXYZ(i + 0, pA.x, pA.y, pA.z);
            flattenPositisionAttribute.setXYZ(i + 1, pB.x, pB.y, pB.z);
            flattenPositisionAttribute.setXYZ(i + 2, pC.x, pC.y, pC.z);


            pA.fromBufferAttribute(positionAttribute, vA);
            pB.fromBufferAttribute(positionAttribute, vB);
            pC.fromBufferAttribute(positionAttribute, vC);
            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab);
            cb.normalize();

            vertexNormals[vA].push(cb.clone());
            vertexNormals[vB].push(cb.clone());
            vertexNormals[vC].push(cb.clone());

            faces.push({
                vA: vA,
                vB: vB,
                vC: vC,
                nA: i,
                nB: i + 1,
                nC: i + 2,
                normal: cb.clone(),
            });

        }

        faces.map(face => {

            nA = calcNormal(vertexNormals[face.vA], face.normal, angle);
            nB = calcNormal(vertexNormals[face.vB], face.normal, angle);
            nC = calcNormal(vertexNormals[face.vC], face.normal, angle);

            normalAttribute.setXYZ(face.nA, nA.x, nA.y, nA.z);
            normalAttribute.setXYZ(face.nB, nB.x, nB.y, nB.z);
            normalAttribute.setXYZ(face.nC, nC.x, nC.y, nC.z);

        })

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", flattenPositisionAttribute);
        geometry.setAttribute("normal", normalAttribute);

        return geometry;
    }

}