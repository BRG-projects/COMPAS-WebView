export const vertexShader = `
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

export const fragmentShader = `
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