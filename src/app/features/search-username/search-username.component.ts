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
    const waitForGlobals = () => {
      const scene: Scene = (window as any).threeScene;
      const camera: PerspectiveCamera = (window as any).threeCamera;
      const renderer: WebGLRenderer = (window as any).threeRenderer;

      if (!scene || !camera || !renderer || (window as any).isLoadingIntro) {
        // show the search username component until the user presses enter
        console.warn(
          'SearchUsernameComponent: Waiting for Three.js globals...'
        );
        requestAnimationFrame(waitForGlobals);
        return;
      }

      const loadingComponentInstructions: HTMLElement | null = // remove the loading component instructions
        document.getElementById('loading-production-instructions');
      if (loadingComponentInstructions) {
        loadingComponentInstructions.remove();
      }

      const searchUsernameComponentInstructions: HTMLElement | null = // show the instruction from search username component
        document.getElementById('search-username-production-instructions');
      if (searchUsernameComponentInstructions) {
        searchUsernameComponentInstructions.style.display = 'block';
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

      // spotify user id validation
      function isValidSpotifyUserId(userId: string): boolean {
        // spotify user ids are typically 28 characters long and contain alphanumeric characters
        // format: base62 encoded string (alphanumeric, no special characters)
        const spotifyUserIdRegex = /^[a-zA-Z0-9]{28}$/;
        return spotifyUserIdRegex.test(userId.trim());
      }

      function createMagnifyingLensTextTexture(text: string) {
        // create a basic text texture

        const canvas = document.createElement('canvas'); // canvas exclusively for text
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d'); // 2d rendering
        if (!ctx) {
          // just in case
          console.error('Could not load 2D context');
          return null;
        }
        ctx.fillStyle = 'black'; // black text
        ctx.font = '16px Segoe UI'; // font
        ctx.textAlign = 'center';
        ctx.fillText(text, 128, 20); // text

        return new CanvasTexture(canvas);
      }

      const magnifyingLensTextTexture =
        createMagnifyingLensTextTexture('Hello, World!'); // create the texture
      const magnifyingLensTextMaterial = new MeshBasicMaterial({
        // create the texture on the material
        map: magnifyingLensTextTexture,
        transparent: true,
      });

      function updateMagnifyingLensTextTexture(text: string) {
        if (magnifyingLensTextMaterial.map) {
          magnifyingLensTextMaterial.map.dispose();
          magnifyingLensTextMaterial.map =
            createMagnifyingLensTextTexture(text);
        }
      }

      const magnifyingLensTextGeometry = new PlaneGeometry(0.9, 0.3); // create the geometry for the text material
      const magnifyingLensTextMesh = new Mesh(
        magnifyingLensTextGeometry,
        magnifyingLensTextMaterial
      ); // bake the mesh
      magnifyingLensTextMesh.position.y = 0.03; // update the mesh frame for the text to be upright
      magnifyingLensTextMesh.rotation.x = -Math.PI / 2;
      magnifyingLensTextMesh.rotation.z = -Math.PI / 2;

      searchLensMesh.add(magnifyingLensTextMesh);

      updateMagnifyingLensTextTexture('Paste your username here!');

      document.addEventListener('paste', async (e) => {
        // receive paste events
        e.preventDefault();
        try {
          const pastedText = await navigator.clipboard.readText();
          
          // validate the pasted text as a spotify user id
          if (isValidSpotifyUserId(pastedText)) {
            updateMagnifyingLensTextTexture(pastedText);
            searchStarted = true; // start the spinning animation
            console.log('Valid Spotify user ID detected, starting animation!');
            
            // update the instruction message when valid id is detected
            const searchUsernameComponentInstructions: HTMLElement | null = 
              document.getElementById('search-username-production-instructions');
            if (searchUsernameComponentInstructions) {
              searchUsernameComponentInstructions.textContent = 'Searching Through Spodify User';
            }
          } else {
            updateMagnifyingLensTextTexture('Invalid ID format!');
            searchStarted = false; // stop animation if invalid
          }
        } catch (err) {
          updateMagnifyingLensTextTexture('Paste failed!');
          searchStarted = false;
        }
      });

      renderer.domElement.tabIndex = 0; // make canvas focusable
      renderer.domElement.focus(); // give it focus

      // Keyboard event handling
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchStarted) {
          // User pressed Enter and has a valid ID - proceed to next step
          console.log('Enter pressed with valid ID, proceeding...');
          // TODO: Add your logic here to proceed to the next step
          // For example: navigate to a new component, make API call, etc.
        }
      });

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
    waitForGlobals();
  }
}
