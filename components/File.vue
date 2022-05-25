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
import { AnimationMixer } from "three";
import * as THREE from "three";

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
      fileExample: "DamagedHelmet.gltf",
      fileInput: null,
      fileURL: "",
      animations: [],
      repoOwner: "BlockResearchGroup",
      repoName: "Phoenix",
      pat: "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",
      folder: "data",
      tag: "",
      file: "",
    };
  },
  methods: {
    ...mapActions("repo", ["getTags", "getFiles", "getFile"]),
    ...mapActions("scene", ["refreshTree"]),

    async load() {
      try {
        let file;
        if (this.fileSource === "URL") {
          file = this.fileURL;
        }
        if (this.fileSource === "Local") {
          const toBase64 = (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = (error) => reject(error);
            });

          file = await toBase64(this.fileInput);
        }
        if (this.fileSource === "Examples") {
          file = this.fileExample;
          if (!window.location.host.includes("localhost"))
            file = "/GLTF_viewer/" + file;
        }

        this.fileLoading = true;

        let load_gltf = (gltf) => {
          let three = window.three;

          three.gltfGroup.add(gltf.scene);

          three.mixer = new AnimationMixer(gltf.scene);
          three.animations = gltf.animations.map((anime) => {
            return {
              name: anime.name,
              action: mixer.clipAction(anime),
            };
          });

          console.log(gltf);
          // gltf.scene.traverse(function (child) {
          //   if (child instanceof THREE.Mesh) {
          //     child.material.flatShading = false;
          //     child.geometry.computeVertexNormals();
          //   }
          // });


          this.fileLoading = false;
          this.refreshTree(three.scene);
        };

        if (this.fileSource === "Repo") {
          let content = await this.getFile({
            owner: this.repoOwner,
            repo: this.repoName,
            pat: this.pat,
            path: this.folder + "/" + this.file,
            ref: this.tag,
          });

          three.loader.parse(content, "/", load_gltf);
        } else {
          three.loader.load(file, load_gltf);
        }
      } catch (e) {
        console.log(e);
        this.fileLoading = false;
        alert(e);
      }
    },

    async fetch() {
      await this.getTags({
        owner: this.repoOwner,
        repo: this.repoName,
        pat: this.pat,
      });

      // this.tag = this.tagNames[0];
    },
  },
  watch: {
    pat() {
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
      await this.fetch();
    }
  },
};
</script>