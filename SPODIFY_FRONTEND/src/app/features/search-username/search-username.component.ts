import { Component } from '@angular/core';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshPhongMaterial,
  Mesh,
  CylinderGeometry,
  TorusGeometry,
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
    const scene:Scene = (window as any).threeScene;
    const camera: PerspectiveCamera = (window as any).threeCamera;
    const renderer: WebGLRenderer = (window as any).threeRenderer;
    /**
     * THE SEARCH 3D MESHES
     */
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
    /**
     * THE ANIMATIONS
     */
    let angle: number = 0; // light rotation
    function animate() {
      requestAnimationFrame(animate); // request call for the next frame
      angle -= 0.01; // move light along circular path
      renderer.render(scene, camera); // render the scene from the perspective of the camera
      /**
       * SEARCH MAGNIFYING GLASS
       */
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
    animate(); // start the animation
    window.addEventListener('resize', onWindowResize); // listen for browser resizing
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight; // camera's aspect ratio match the browsers aspect ratio
      camera.updateProjectionMatrix(); // recalculate projections with new aspect ratio
      renderer.setSize(window.innerWidth, window.innerHeight); // update the renderer to match the browsers dimensions
    }
  }
}
