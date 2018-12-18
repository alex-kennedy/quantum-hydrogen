import React, { Component } from 'react';
import * as THREE from 'three';
import QuantumState from '../components/QuantumState'

var OrbitControls = require('three-orbit-controls')(THREE)

class ThreeScene extends Component {
    constructor(props) {
        super(props)
        this.updateDimensions = this.updateDimensions.bind(this)
        this.redrawQuantumState = this.redrawQuantumState.bind(this)
    }

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        window.addEventListener("resize", this.updateDimensions);

        //ADD SCENE
        this.scene = new THREE.Scene()

        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        this.camera.position.z = 4

        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)

        //ADD CUBE
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: '#433F81'})
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)

        // CONTROLS
        const controls = new OrbitControls(this.camera, document.getElementById('bg'));
        this.controls = controls;
        this.controls.enablePan = false;
        this.controls.enableKeys = false;
        this.controls.enableDamping = true;

        this.start()
        
        // Add quantum number event listeners
        document.getElementById('n').addEventListener('input', this.waitToRedrawQuantumState);
        document.getElementById('l').addEventListener('input', this.waitToRedrawQuantumState);
        document.getElementById('m').addEventListener('input', this.waitToRedrawQuantumState);

        // Quantum state and redraw timer
        this.redrawTimer = 0;
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    updateDimensions = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    validateQuantumState = () => {
        let n = parseInt( document.getElementById('n').value );
        let l = parseInt( document.getElementById('l').value );
        let m = parseInt( document.getElementById('m').value );

        console.log(n, l, m);
        
        if ( isNaN(n) || isNaN(l) || isNaN(m) ) {
            console.log('invalid!')
            return false; // a value is empty
        } else if (n > 50 || n < 1 || l < 0) {
            console.log('invalid!')
            return false; // n or l negative, n too large. 
        } else if (Math.abs(m) > l) {
            console.log('invalid!')
            return false; // +/- m must be less than l
        } 

        return true;
    }

    waitToRedrawQuantumState = () => {
        clearTimeout(this.redrawTimer);

        if ( this.validateQuantumState() ) {
            this.redrawTimer = setTimeout(this.redrawQuantumState, 0)
        }
    }

    redrawQuantumState = () => {
        let state = {
            n: parseInt( document.getElementById('n').value ),
            l: parseInt( document.getElementById('l').value ),
            m: parseInt( document.getElementById('m').value )
        }
        this.quantumState = new QuantumState(state);
        console.log(this.quantumState)
    }

    render() {
        return(
            <div
                style={{ width: '100%', height: '100%', id: 'canvas' }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

export default ThreeScene