import { MeshView } from "./mesh";

export default function loadCOMPAS(content) {
    if (!Array.isArray(content)) content = [content];
    content.forEach(function (obj) {
        if (obj.data.dtype === "compas.datastructures/Mesh"){
            let meshView = new MeshView(obj.data, obj.settings);
            three.objectsGroup.add(meshView);
        }
    });
    // three.adaptAttributesColorToTheme(this.$vuetify.theme.dark);

}