import { Component } from '@angular/core';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshPhongMaterial,
  Mesh,
  CylinderGeometry,
  TorusGeometry,
  MeshBasicMaterial,
  PlaneGeometry,
  CanvasTexture,
} from 'three';

@Component({
  selector: 'app-search-username',
  standalone: true,
  imports: [],
  templateUrl: './search-username.component.html',
  styleUrl: './search-username.component.scss',
})
export class SearchUsernameComponent {
  ngAfterViewInit() {
    const waitForScene = () => {
      const scene: Scene = (window as any).threeScene;
      const camera: PerspectiveCamera = (window as any).threeCamera;
      const renderer: WebGLRenderer = (window as any).threeRenderer;

      if (
        !scene ||
        !camera ||
        !renderer ||
        !(window as any).showSearchUsernameComponent
      ) {
        // show the search username component until the user presses enter
        console.warn('Waiting for Three.js globals...');
        requestAnimationFrame(waitForScene);
        return;
      }

      const loadingComponentInstructions: HTMLCollectionOf<Element> =
        document.getElementsByClassName('production instructions loading');
      for (let i = 0; i < loadingComponentInstructions.length; i++) {
        // remove the instruction from loading component
        const instruction = loadingComponentInstructions[i];
        instruction.remove();
      }

      const searchUsernameComponentInstructions: HTMLCollectionOf<Element> =
        document.getElementsByClassName(
          'production instructions search username'
        );
      for (let i = 0; i < searchUsernameComponentInstructions.length; i++) {
        // show the instruction from search username component
        const instruction = searchUsernameComponentInstructions[
          i
        ] as HTMLElement;
        instruction.style.display = 'block';
      }

      // search lens
      const searchLensGeometry: CylinderGeometry = new CylinderGeometry(
        0.5,
        0.5,
        0.05
      );
      const searchLensMaterial: MeshPhongMaterial = new MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x696969,
        transparent: true,
        opacity: 0.5,
      });
      const searchLensMesh: Mesh = new Mesh(
        searchLensGeometry,
        searchLensMaterial
      );
      searchLensMesh.castShadow = true;
      searchLensMesh.receiveShadow = true;
      scene.add(searchLensMesh);
      // search frame
      const searchFrameGeometry: TorusGeometry = new TorusGeometry(
        0.5,
        0.05,
        16,
        100
      );
      const searchFrameMaterial: MeshPhongMaterial = new MeshPhongMaterial({
        color: 0xffd700, // make the frame gold
        specular: 0x696969,
      });
      const searchFrameMesh: Mesh = new Mesh(
        searchFrameGeometry,
        searchFrameMaterial
      );
      searchFrameMesh.castShadow = true;
      searchFrameMesh.receiveShadow = true;
      scene.add(searchFrameMesh);
      // magnifying glass handle
      const searchHandleGeometry: CylinderGeometry = new CylinderGeometry(
        0.05,
        0.05,
        0.75
      );
      const searchHandleMaterial: MeshPhongMaterial = new MeshPhongMaterial({
        color: 0xffd700, // make the frame gold
        specular: 0x696969,
      });
      const searchHandleMesh: Mesh = new Mesh(
        searchHandleGeometry,
        searchHandleMaterial
      );
      scene.add(searchHandleMesh);

      // search bar
      let searchStarted: Boolean = false;

      function createMagnifyingLensTextTexture(text: string) { // create a basic text texture

        const canvas = document.createElement('canvas'); // canvas exclusively for text
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d'); // 2d rendering
        if (!ctx) { // just in case
          console.error('Could not load 2D context');
          return null;
        }
        ctx.fillStyle = 'black'; // black text
        ctx.font = '16px Segoe UI'; // font
        ctx.textAlign = 'center'; 
        ctx.fillText(text, 128, 20); // text

        return new CanvasTexture(canvas);
      }

     

      const magnifyingLensTextTexture = createMagnifyingLensTextTexture("Hello, World!");  // create the texture
      const magnifyingLensTextMaterial = new MeshBasicMaterial({ // create the texture on the material
        map: magnifyingLensTextTexture,
        transparent: true,
      });

      function updateMagnifyingLensTextTexture(text: string) {
        if (magnifyingLensTextMaterial.map)
        {
          magnifyingLensTextMaterial.map.dispose();
          magnifyingLensTextMaterial.map = createMagnifyingLensTextTexture(text);
        }

      }

      const magnifyingLensTextGeometry = new PlaneGeometry(0.9, 0.3); // create the geometry for the text material
      const magnifyingLensTextMesh = new Mesh(magnifyingLensTextGeometry, magnifyingLensTextMaterial); // bake the mesh
      magnifyingLensTextMesh.position.y = 0.03; // update the mesh frame for the text to be upright
      magnifyingLensTextMesh.rotation.x = -Math.PI / 2;
      magnifyingLensTextMesh.rotation.z = -Math.PI / 2;

      searchLensMesh.add(magnifyingLensTextMesh);

      updateMagnifyingLensTextTexture("Paste your username here!");

      document.addEventListener('paste', async (e) => { // receive paste events
        e.preventDefault();
        try {
          const pastedText = await navigator.clipboard.readText();
          
          updateMagnifyingLensTextTexture(pastedText);
          

        } catch (err) {
          updateMagnifyingLensTextTexture("Paste failed!");
        }
      });
      
      renderer.domElement.tabIndex = 0; // make canvas focusable
      renderer.domElement.focus(); // give it focus

      /**
       * THE ANIMATIONS
       */
      let angle: number = 0.78; // light rotation

      function updateMagnifyingGlassFrame(angle: number) {
        searchLensMesh.position.set(
          // make the lens "hop" around the spotify sphere
          1.5 * Math.sin(angle), // spin the lens around the spotify sphere
          Math.abs(0.5 * Math.sin(angle * 3)), // move the lens up and down
          1.5 * Math.cos(angle) // spin the lens around the spotify sphere
        );
        searchLensMesh.rotation.set(
          0,
          angle + Math.PI / 2, // have lens face the spotify sphere
          Math.PI / 2 // have lens stand upright
        );
        searchFrameMesh.position.set(
          // make the frame "hop" around the spotify sphere
          1.5 * Math.sin(angle), // spin the frame around the spotify sphere
          Math.abs(0.5 * Math.sin(angle * 3)), // move the frame up and down
          1.5 * Math.cos(angle) // spin the frame around the spotify sphere
        );
        searchFrameMesh.rotation.set(
          0,
          angle, // have frame face the spotify sphere
          Math.PI / 2 // have frame stand upright
        );
        searchHandleMesh.position.set(
          // make the handle "hop" around the spotify sphere
          1.5 * Math.sin(angle), // spin the handle around the spotify sphere
          Math.abs(0.5 * Math.sin(angle * 3)) - 0.875, // move the handle up and down
          1.5 * Math.cos(angle) // spin the handle around the spotify sphere
        );
        searchHandleMesh.rotation.set(
          0, // handle stays put
          angle, // have handle face the spotify sphere
          0 // handle stays put
        );
      }
      function animate() {
        requestAnimationFrame(animate); // request call for the next frame
        renderer.render(scene, camera); // render the scene from the perspective of the camera
        /**
         * SEARCH MAGNIFYING GLASS
         */
        if (searchStarted) {
          angle -= 0.01; // move light along circular path
          updateMagnifyingGlassFrame(angle);
        }
      }
      updateMagnifyingGlassFrame(angle);
      animate(); // start the animation
    };
    waitForScene();
  }
}
