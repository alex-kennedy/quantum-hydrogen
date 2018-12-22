import React, { Component } from 'react';
import * as THREE from 'three';
import QuantumState from '../components/QuantumState'

var OrbitControls = require('three-orbit-controls')(THREE)

class ThreeScene extends Component {
    constructor(props) {
        super(props);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.redrawQuantumState = this.redrawQuantumState.bind(this);
    }

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        window.addEventListener("resize", this.updateDimensions);

        //ADD SCENE
        this.scene = new THREE.Scene();

        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            1,
            2000
        );
        this.camera.position.z = 400;

        // LIGHTS
        let ambientLight = new THREE.AmbientLight(0x000000);
        this.scene.add(ambientLight);

        var lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 0, 600 );
        lights[ 1 ].position.set( 0, 0, 0 );
        lights[ 2 ].position.set( 600, 600, 600 );

        this.scene.add( lights[ 0 ] );
        this.scene.add( lights[ 1 ] );
        this.scene.add( lights[ 2 ] );

        // CONTROLS
        const controls = new OrbitControls(this.camera, document.getElementById('bg'));
        this.controls = controls;
        this.controls.enablePan = false;
        this.controls.enableKeys = false;
        this.controls.enableDamping = true;
        this.controls.target.set(0, 0, 200);
        
        // Radial segments when drawing shapes
        this.radialResolution = 50;

        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor('#000000', 1);
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);


        // Add quantum number event listeners
        document.getElementById('n').addEventListener('input', this.waitToRedrawQuantumState);
        document.getElementById('l').addEventListener('input', this.waitToRedrawQuantumState);
        document.getElementById('m').addEventListener('input', this.waitToRedrawQuantumState);

        // Quantum state and redraw timer
        this.redrawTimer = 0;
        
        // Material for states
        this.quantumMaterial = new THREE.MeshLambertMaterial({
            wireframe: false, 
            side: THREE.DoubleSide, 
            color: new THREE.Color().setHSL( 0, 0.5, 0.5 ),
            reflectivity: 0.8,

        });
        
        this.start();
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

    processRawContours(contourLines, gridSize) {
        let newLines = [];
        let il = -1;
        let ipNew = -1;
        let ip, ic, edgeZone, line;

        for (ic = 0; ic < contourLines.length; ic++) {
            edgeZone = true;
            line = contourLines[ic];

            for (ip = 1; ip < line.length; ip++) {
                if (line[ip][0] === 0 || line[ip][0] === gridSize-1 || line[ip][1] === 0 || line[ip][1] === 2*gridSize-1) {
                    // point ip is an edge
                    if (edgeZone) {
                        continue;
                    } else {
                        edgeZone = true;
                    }

                } else {
                    if (edgeZone) {
                        edgeZone = false;
                        
                        // A new line is beginning
                        il += 1;
                        newLines[il] = [];
                        ipNew = -1;
                    } 

                    ipNew += 1
                    newLines[il][ipNew] = line[ip];
                }
            }
        }

        return newLines;
    }

    buildBufferGeometryFromContour(contour) {
        // Based on THREE.SphereBufferGeometry
        // https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js

        let geometry = new THREE.BufferGeometry();

        let index = 0;
        let grid = [];

        let ix, iy;
        
        let vertex = new THREE.Vector3();
        let normal = new THREE.Vector3();

        let indices = [];
        let vertices = [];
        let normals = [];
        let uvs = [];

        for (iy = 0; iy < contour.length; iy++) {
            let verticesRow = [];
            let v = iy / contour.length;

            for (ix = 0; ix <= this.radialResolution; ix++) {
                var u = ix / this.radialResolution;
                var angle = 2 * Math.PI * u;

                vertex.x = contour[iy][0] * Math.cos(angle);
                vertex.y = contour[iy][0] * Math.sin(angle);
                vertex.z = contour[iy][1];

                vertices.push(vertex.x, vertex.y, vertex.z);

                normal.set(vertex.x, vertex.y, vertex.z).normalize();
                normals.push(normal.x, normal.y, normal.z);
                
                uvs.push(u, 1 - v);

                verticesRow.push(index++);
            }

            grid.push(verticesRow);
        }

        for ( iy = 0; iy < contour.length - 1; iy ++ ) {
            for ( ix = 0; ix < this.radialResolution; ix ++ ) {
                var a = grid[ iy ][ ix + 1 ];
                var b = grid[ iy ][ ix ];
                var c = grid[ iy + 1 ][ ix ];
                var d = grid[ iy + 1 ][ ix + 1 ];
    
                if (iy !== 0) indices.push(a, b, d);
                if (iy !== contour.length - 1) indices.push(b, c, d);
            }
        }
        
        geometry.setIndex(indices);
	    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3) );
	    geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute(normals, 3) );
        geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute(uvs, 2) );

        return geometry;
    }

    waitToRedrawQuantumState = () => {
        clearTimeout(this.redrawTimer);

        if ( this.validateQuantumState() ) {
            this.redrawTimer = setTimeout(this.redrawQuantumState, 1000);
        }
    }

    redrawQuantumState = () => {
        let state = {
            n: parseInt( document.getElementById('n').value ),
            l: parseInt( document.getElementById('l').value ),
            m: parseInt( document.getElementById('m').value )
        }
        this.quantumState = new QuantumState(state);

        let lines = this.processRawContours(this.quantumState.contourLines, this.quantumState.probGridSize);
        for (let i = 0; i < lines.length; i++) {
            let bufferGeometry = this.buildBufferGeometryFromContour(lines[i]);
            let mesh = new THREE.Mesh(bufferGeometry);

            mesh.material = this.quantumMaterial;
            this.scene.add(mesh);
        }
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