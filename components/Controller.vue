<template>
  <v-navigation-drawer :value="showController" right app fixed width="400">
    <v-list>
      <v-list-group v-model="showSource">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>File</v-list-item-title>
          </v-list-item-content>
        </template>

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
                <v-text-field label="Folder" v-model="folder"></v-text-field>
                <v-select
                  label="Version"
                  v-model="tag"
                  :items="tagNames"
                ></v-select>
                <v-select
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
      </v-list-group>

      <v-list-group v-model="showScene">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Scene</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <v-treeview
              :items="scene"
              v-model="sceneSelection"
              selection-type="independent"
              selectable
              hoverable
              selected-color="green"
            ></v-treeview>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group v-model="showAnimation">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Animation</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-if="animations.length == 0">
          <v-list-item-content> No animations available. </v-list-item-content>
        </v-list-item>

        <v-list-item v-for="(anime, i) in animations" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ anime.name }}</v-list-item-title>
            <div>
              <v-icon color="green" @click="anime.action.play()"
                >mdi-play</v-icon
              >
              <v-icon color="red" @click="anime.action.stop()">mdi-stop</v-icon>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";
import * as THREE from "three";

export default {
  name: "Controller",
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
      showSource: true,
      fileSource: "Examples",
      fileLoading: false,
      showAnimation: false,
      fileExample: "DamagedHelmet.gltf",
      fileInput: null,
      fileURL: "",
      showScene: false,
      scene: [],
      animations: [],
      sceneSelection: [],
      repoOwner: "BlockResearchGroup",
      repoName: "Phoenix",
      pat: null,
      folder: "data",
      tag: "",
      file: "",
    };
  },
  methods: {
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
          window.scene.add(gltf.scene);

          window.mixer = new THREE.AnimationMixer(gltf.scene);
          this.animations = gltf.animations.map((anime) => {
            return {
              name: anime.name,
              action: mixer.clipAction(anime),
            };
          });

          console.log(gltf);
          this.fileLoading = false;
          this.refresh();
        };

        if (this.fileSource === "Repo") {
          let content = await this.getFile({
            owner: this.repoOwner,
            repo: this.repoName,
            pat: this.pat,
            path: this.folder + "/" + this.file,
          });

          window.loader.parse(content, "/", load_gltf);
        } else {
          window.loader.load(file, load_gltf);
        }
      } catch (e) {
        console.log(e);
        this.fileLoading = false;
        alert(e);
      }
    },

    refresh() {
      this.sceneSelection = [];
      let getChildren = (parent) => {
        return parent.children.map((child) => {
          this.sceneSelection.push(child.id);
          return {
            name: `<${child.constructor.name}>${child.name}`,
            id: child.id,
            children: getChildren(child),
          };
        });
      };
      this.scene = getChildren(window.scene);
    },

    async fetch() {
      await this.getTags({
        owner: this.repoOwner,
        repo: this.repoName,
        pat: this.pat,
      });

      await this.getFiles({
        owner: this.repoOwner,
        repo: this.repoName,
        pat: this.pat,
        path: this.folder,
      });

      this.tag = this.tagNames[0];
    },
    ...mapActions("repo", ["getTags", "getFiles", "getFile"]),
  },
  watch: {
    sceneSelection(selection) {
      window.scene.traverse((child) => {
        if (child == window.scene) return;
        if (selection.includes(child.id)) {
          child.visible = true;
        } else {
          child.visible = false;
        }
      });
    },

    pat() {
      this.fetch();
    },
  },

  async mounted() {
    if (this.repoName && this.repoOwner && this.pat) {
      await this.fetch();
    }
  },
};
</script>
