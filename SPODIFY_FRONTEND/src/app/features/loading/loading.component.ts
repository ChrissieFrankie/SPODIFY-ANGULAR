import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>; // canvas element reference

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement; // canvas native element reference
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
    camera.position.set(2, 2, 2); // set position directly above
    camera.lookAt(0, 0, 0); // look at the center of the sphere
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // make it look more realistic
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const geometry = new THREE.SphereGeometry(1, 32, 32); // create sphere geometry
    const material = new THREE.MeshPhongMaterial({ color: 0x1DB954, specular: 0x696969 }); // create sphere material to be green responsive to light
    const sphere = new THREE.Mesh(geometry, material); // create sphere
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere); // add sphere to scene
    const spotifySignalWaves = new THREE.TextureLoader().load('/SpotifySignalWaves.png'); // load the signal waves
    const decalMaterial = new THREE.MeshPhongMaterial({map:spotifySignalWaves, transparent:true, specular: 0x696969 }); // material for transparent png
    const decalPosition = new THREE.Vector3(0.8, 0.9, 1); // near the surface
    const decalOrientation = new THREE.Euler(Math.PI / -4, Math.PI / 6, Math.PI / 6); // position facing the user
    const decalSize = new THREE.Vector3(1.7, 1.7, 1.7); // self explanatory
    const decalGeometry = new DecalGeometry(sphere, decalPosition, decalOrientation, decalSize); // create decal geometry
    const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial); // create the decal mesh
    scene.add(decalMesh);
    const plateGeometry = new THREE.BoxGeometry(2, 0.1, 2); // create square plate geometry
    const plateMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 }); // fifty shades of grey lol
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.set(0, -1, 0); // position just below the sphere
    plate.rotation.y = Math.PI / 2; // rotate the plate 90 degrees
    plate.receiveShadow = true;
    plate.castShadow = true;
    scene.add(plate);
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1); // create light
    directionalLight.target = sphere; // aim the light at the sphere
    directionalLight.castShadow = true; // cast shadow
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1); // soft white ambient light
    scene.add(ambientLight);
    scene.add(directionalLight); // add light to scene
    let angle = 0; // light rotation
    const radius = 2; // radius of circular path for light rotation
    let yRotation = 0; // plate rotation
    function animate() {
      requestAnimationFrame(animate); // request call for the next frame
      angle += 0.01; // move light along circular path
      directionalLight.position.set(
        0,// light is rotating around the x axis counter clockwise
        radius * Math.cos(angle), // light is oscillating the y axis
        radius * Math.sin(angle) // light is oscillating the z axis
      );
      yRotation += 0.01; // increase the y rotation
      plate.rotation.y = angle; // rotate the plate 
      renderer.render(scene, camera); // render the scene from the perspective of the camera
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
