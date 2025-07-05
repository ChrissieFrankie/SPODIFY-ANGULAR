import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './features/loading/loading.component';
import { SearchUsernameComponent } from './features/search-username/search-username.component';
import { Scene, PerspectiveCamera, WebGLRenderer, PCFSoftShadowMap } from 'three';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, SearchUsernameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SPODIFY_FRONTEND';

  ngAfterViewInit() {
    const canvas = document.getElementById('three-canvas') as HTMLCanvasElement; // get the app canva
    const scene: Scene = new Scene();
    (window as any).threeScene = scene; // make the scene global
    const camera: PerspectiveCamera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.5,
      1000
    );
    (window as any).threeCamera = camera; // make the camera global
    camera.position.set(2, 2, 2); // set position directly above
    camera.lookAt(0, 0, 0); // look at the center of the sphere
    const renderer: WebGLRenderer = new WebGLRenderer({ canvas });
    (window as any).threeRenderer = renderer; // make the camera global
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // make it look more realistic
    renderer.shadowMap.type = PCFSoftShadowMap;

    window.addEventListener('resize', onWindowResize); // listen for browser resizing
    
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight; // camera's aspect ratio match the browsers aspect ratio
      camera.updateProjectionMatrix(); // recalculate projections with new aspect ratio
      renderer.setSize(window.innerWidth, window.innerHeight); // update the renderer to match the browsers dimensions
    }
  }
}
