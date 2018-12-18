import { gamma } from 'mathjs';
import {isoLines, QuadTree} from 'marchingsquares';

function factorial(k) {
    return gamma(k + 1);
}

// Binomial coefficient
function binomial(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
}


class QuantumState {
    constructor(props) {
        this.n = props.n;
        this.l = props.l;
        this.m = props.m;

        this.q = this.n + this.l
        this.p = 2*this.l + 1

        // The Bohr Radius
        this.BOHR = 5.29177211e-11 //m 

        // Quantum State Functions
        this.legCoefs = this.getLegendreCoefs();
        this.assocLegCoefs = this.getAssociatedLegendreCoefs();
        this.sphericalHarmonicCoef = this.getSphericalHarmonicCoef();
        this.lagCoefs = this.getLaguerreCoefs()
        this.assocLagCoefs = this.getAssociatedLaguerreCoefs();
        this.psiNormalization = this.getPsiNormalization();

        // Grid size (roughly, the resolution)
        this.probGridSize = 200; 

        // Determine probabibilites and constant probability lines
        this.probGrid = this.getProbabilityGrid();
        this.lines = this.getContour();

    }

    getLegendreCoefs() {
        var c;
        var coefs = new Array(this.l);
        for (var k=0; k <= this.l; k++) {
            c = Math.pow(2, this.l);
            c *= binomial(this.l, k);
            c *= binomial((this.l + k - 1)/2, this.l);

            coefs[k] = c;
        }

        return coefs
    }

    getAssociatedLegendreCoefs() {
        var m = Math.abs(this.m);
        var coefs = new Array(this.l - m + 1);

        for (var i = 0; i <= this.l - m; i++) {
            coefs[i] = this.legCoefs[m + i] * factorial(i + m) / factorial(i);
        }

        return coefs;
    }

    getSphericalHarmonicCoef() {
        var epsilon = this.m >= 0 ? Math.pow(-1, this.m) : 1;

        var m = this.m;
        var preFactor = Math.pow(((2*this.l + 1) / (4 * Math.PI)) * (factorial(this.l - m) / factorial(this.l + m)), 1/2)

        return epsilon * preFactor;
    }

    getLaguerreCoefs() {
        var coefs = new Array(this.q + 1)

        for (var k = 0; k <= this.q; k++) {
            coefs[k] = Math.pow(-1, k) * Math.pow(factorial(this.q) / factorial(k), 2) / factorial(this.q - k);
        }

        return coefs;
    }

    getAssociatedLaguerreCoefs() {
        var coefs = new Array(this.q + 1 - this.p);

        for (var k = 0; k <= this.q - this.p; k++) {
            coefs[k] = this.lagCoefs[this.p + k] * factorial(this.p + k) / factorial(k);
        }

        return coefs;
    }

    getPsiNormalization() {
        var norm = Math.pow((2/(this.n*this.BOHR)), 3)
        norm *= factorial(this.n - this.l - 1);
        norm /= 2*this.n * Math.pow(factorial(this.n + 1), 3);
        norm = Math.sqrt(norm)
        norm /= Math.pow((this.n * this.BOHR), this.l)

        return norm;
    }

    associatedLegendre(x) {
        let multiplier = Math.pow((1 - Math.pow(x, 2)), (Math.abs(this.m) / 2));
        let p = 0;

        for (let i = 0; i < this.assocLegCoefs.length; i++) {
            p += this.assocLegCoefs[i] * Math.pow(x, i);
        }

        return multiplier * p;
    }

    associatedLaguerre(x) {
        let p = 0;

        for (let i = 0; i < this.assocLagCoefs.length; i++) {
            p += Math.pow(-1, this.p) * this.assocLagCoefs[i] * Math.pow(x, i);
        }

        return p;
    }

    sphericalHarmonic(theta) {
        return this.sphericalHarmonicCoef * this.associatedLegendre(Math.cos(theta));
    }

    probabilityDensity(r, theta) {
        let psi = this.psiNormalization;
        psi *= Math.exp(-r / (this.n * this.BOHR));
        psi *= Math.pow((2 * r), this.l);
        psi *= this.associatedLaguerre(2*r / (this.n * this.BOHR))
        psi *= this.sphericalHarmonic(theta);
        
        return Math.pow(psi, 2);
    }

    getProbabilityGrid() {
        const maxRadius = 2 * Math.pow(this.n, 2) * this.BOHR;

        let probGrid = new Array(this.probGridSize);
        let x, y, r, theta;

        for (let i = 0; i < this.probGridSize; i++) {
            y = (maxRadius / this.probGridSize) * (i + 1);
            probGrid[i] = new Array(this.probGridSize);

            for (let j = 0; j < this.probGridSize; j++) {
                x = (maxRadius / this.probGridSize) * (j + 1);

                r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                theta = Math.atan(y / x);

                probGrid[i][j] = this.probabilityDensity(r, theta);
            }
        }
        
        return probGrid;
    }

    getContour(level) {
        level = level || 1e28;

        let prepData = new QuadTree(this.probGrid);
        let lines = isoLines(prepData, level);
        
        return lines;
    }
}

export default QuantumState 