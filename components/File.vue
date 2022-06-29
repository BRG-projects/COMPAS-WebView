<template>
  <v-list>
    <v-list-item>
      <v-list-item-content>
        <v-radio-group v-model="fileSource">
          <v-radio value="Repo" label="Repo"></v-radio>
          <v-radio value="Local" label="Local"></v-radio>
          <v-radio value="URL" label="URL"></v-radio>
          <v-radio value="Examples" label="Examples"></v-radio>
        </v-radio-group>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="fileSource === 'Examples'">
      <v-list-item-content>
        <v-select
          label="Examples"
          v-model="fileExample"
          :items="[
            'DamagedHelmet.gltf',
            'DragonAttenuation.glb',
            'InterpolationTest.glb',
            'tubemesh.json',
            'viewobjects.json',
          ]"
        ></v-select>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="fileSource === 'Repo'">
      <v-list-item-content>
        <v-row>
          <v-col>
            <v-text-field label="Owner" v-model="repoOwner"></v-text-field>
            <v-text-field label="Repo" v-model="repoName"></v-text-field>
            <v-text-field label="PAT" v-model="pat"></v-text-field>
            <v-text-field
              label="Folder"
              v-if="pat"
              v-model="folder"
            ></v-text-field>
            <v-select
              v-if="pat"
              label="Version"
              v-model="tag"
              :items="tagNames"
            ></v-select>
            <v-select
              v-if="tag"
              label="File"
              v-model="file"
              :items="fileNames"
            ></v-select>
          </v-col>
        </v-row>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="fileSource === 'Local'">
      <v-list-item-content>
        <v-file-input
          truncate-length="15"
          label="Local File"
          v-model="fileInput"
        ></v-file-input>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="fileSource === 'URL'">
      <v-list-item-content>
        <v-text-field label="URL" v-model="fileURL"></v-text-field>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-btn @click="load" :loading="fileLoading">Load</v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { AnimationMixer, Mesh, EdgesGeometry, LineSegments } from "three";
import autoCreaseDetect from "./convert";
import compasToThree from "./compas";
import axios from "axios";

export default {
  name: "File",
  computed: {
    ...mapState(["showController"]),
    ...mapState("repo", ["tags", "files"]),
    tagNames() {
      return this.tags.map((tag) => tag.name);
    },
    fileNames() {
      return this.files.map((file) => file.name);
    },
  },
  data() {
    return {
      fileSource: "Examples",
      fileLoading: false,
      fileExample: "viewobjects.json",
      fileInput: null,
      fileURL: "",
      animations: [],
      repoOwner: "BlockResearchGroup",
      repoName: "Phoenix",
      pat: localStorage.getItem("pat"),
      folder: "data",
      tag: "",
      file: "",
    };
  },
  methods: {
    ...mapActions("repo", ["getTags", "getFiles", "getFile"]),
    ...mapActions("scene", ["updateTree"]),

    async load() {
      try {
        this.fileLoading = true;

        let file;
        let ext;
        let content;

        switch (this.fileSource) {
          case "URL":
            file = this.fileURL;
            ext = file.toLowerCase().split(".").pop();
            content = await this.fetch_file(file, ext);
            break;

          case "Local":
            const toBase64 = (file) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
              });
            file = await toBase64(this.fileInput);
            ext = this.fileInput.name.toLowerCase().split(".").pop();
            content = await this.fetch_file(file, ext);
            break;

          case "Examples":
            file = this.fileExample;
            if (!window.location.host.includes("localhost"))
              file = "/COMPAS-WebView/" + file;
            ext = file.toLowerCase().split(".").pop();
            content = await this.fetch_file(file, ext);
            break;

          case "Repo":
            ext = this.file.toLowerCase().split(".").pop();
            content = await this.getFile({
              owner: this.repoOwner,
              repo: this.repoName,
              pat: this.pat,
              path: this.folder + "/" + this.file,
              ref: this.tag,
            });
            break;
        }

        switch (ext) {
          case "gltf":
          case "glb":
            let gltf = await three.loader.parseAsync(content, "/");
            three.objectsGroup.add(gltf.scene);
            three.mixer = new AnimationMixer(gltf.scene);
            three.animations = gltf.animations.map((anime) => {
              return {
                name: anime.name,
                action: three.mixer.clipAction(anime),
              };
            });
            // gltf.scene.traverse(function (child) {
            //   if (child instanceof Mesh) {
            //     child.geometry.autoCreaseDetect = autoCreaseDetect;
            //     let angle = 30;
            //     let geometry = child.geometry.autoCreaseDetect(angle);
            //     if (geometry) {
            //       child.material.flatShading = false;
            //       child._geometry = child.geometry;
            //       child.geometry = geometry;
            //       const edges = new EdgesGeometry(geometry, angle);
            //       const line = new LineSegments(edges, three.edgeMaterial);
            //       line.renderOrder = 1;
            //       child.add(line);
            //     }
            //   }
            // });
            break;

          case "json":
            console.log("json", content);
            if (Array.isArray(content)) {
              content.forEach(function (obj) {
                let mesh = compasToThree(obj.data, obj.settings);
                three.objectsGroup.add(mesh);
              });
              three.adaptAttributesColorToTheme(this.$vuetify.theme.dark);
            } else {
              let obj = compasToThree(content);
              if (obj) {
                three.objectsGroup.add(obj);
              }
            }

            break;

          default:
            throw new Error("Unsupported file type");
        }

        three.controls.fitToSphere(three.objectsGroup, true);
      } catch (e) {
        console.error(e);
        this.fileLoading = false;
        alert(e);
      }

      this.updateTree();
      this.fileLoading = false;
    },

    async fetch_file(file, ext) {
      if (ext === "json") return (await axios.get(file)).data;
      else return (await axios.get(file, { responseType: "arraybuffer" })).data;
    },

    async fetch() {
      await this.getTags({
        owner: this.repoOwner,
        repo: this.repoName,
        pat: this.pat,
      });
    },
  },
  watch: {
    pat(pat) {
      localStorage.setItem("pat", pat);
      this.fetch();
    },

    async tag() {
      await this.getFiles({
        owner: this.repoOwner,
        repo: this.repoName,
        pat: this.pat,
        path: this.folder,
        ref: this.tag,
      });
    },
  },

  async mounted() {
    if (this.repoName && this.repoOwner && this.pat) {
      this.fetch();
    }
  },
};
</script>
