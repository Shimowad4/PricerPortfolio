class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    // 2点が重なっているか
    isPointOnPoint(point){
        return point.x == this.x && point.y == this.y;
    }
}

class Line{
    constructor(startPoint, endPoint){
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    // 傾き
    inclination(){
        let x1 = this.startPoint.x;
        let y1 = this.startPoint.y;
        let x2 = this.endPoint.x;
        let y2 = this.endPoint.y;
        if(x2 - x1 == 0) return null;
        return (y2 - y1) / (x2 - x1);
    }

    // 切片
    intercept(){
        let x = this.startPoint.x;
        let y = this.startPoint.y;
        let a = this.inclination();
        return y - a * x;
    }

    // 引数の直線との交点のx座標
    intersectionX(line){
        return SimultaneousEquations(this.inclination(), this.intercept(), line.inclination(), line.intercept());
    }

    // 引数の直線と垂直に交わるか
    isIntersectVertically(line){
        if(this.inclination() == null && line.inclination() == 0 || this.inclination() == 0 && line.inclination() == null) return true; 
        return this.inclination() == -1 / line.inclination();
    }

    // 引数の直線と平行か
    isParallelLine(line){
        return this.inclination() == line.inclination();
    }

    //　引数の点が直線上に存在するか
    isPointOnStraigthLine(point){
        let x1 = this.startPoint.x;
        let y1 = this.startPoint.y;
        let x2 = this.endPoint.x;
        let y2 = this.endPoint.y;
        let x = point.x;
        let y = point.y;

        return (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1) == 0;
    }

    // 長さ
    length(){
        return Math.sqrt((this.startPoint.x - this.endPoint.x) ** 2 + (this.startPoint.y - this.endPoint.y) ** 2);
    }
}

class Triangle{
    constructor(a, b, c){
        this.a = a;
        this.b = b;
        this.c = c;
        this.ab = new Line(a, b);
        this.bc = new Line(b, c);
        this.ca = new Line(c, a);
    }

    cosB(){
        let abLen = this.ab.length();
        let bcLen = this.bc.length();
        let caLen = this.ca.length();
        let abLenSq = Math.round(abLen ** 2);
        let bcLenSq = Math.round(bcLen ** 2);
        let caLenSq = Math.round(caLen ** 2);
        return (abLenSq + bcLenSq - caLenSq) / (2 * abLen * bcLen);
    }

    // 角ABCの角度
    angleABC(){
        return Math.round(Math.acos(this.cosB()) * 180 / Math.PI);
    }
}

class QuadrilateralShape{
    constructor(a, b, c, d){
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.ab = new Line(a, b);
        this.bc = new Line(b, c);
        this.cd = new Line(c, d);
        this.da = new Line(d, a);
    }

    // 任意の内角の角度
    angle(o, p, q){
        let opq = new Triangle(o, p, q);
        return opq.angleABC();
    }

    // 四角形の周りの長さ
    getPerimeter(){
        return this.ab.length() + this.bc.length() + this.cd.length() + this.da.length();
    }

    // 四角形の面積
    getArea(){
        if(this.isTwistedQuadrilateral){
            let px = this.twistedQuadrilateralIntersectionX();
        }

        let angleABC = this.angle(this.a, this.b, this.c);
        let areaABC = 1 / 2 * this.ab.length() * this.bc.length() * Math.sin(angleABC * Math.PI / 180);
        let angleCDA = this.angle(this.c, this.d, this.a);
        let areaCDA = 1 / 2 * this.da.length() * this.cd.length() * Math.sin(angleCDA * Math.PI / 180);
        return areaABC + areaCDA;
    }

    // 四角形か
    isQuadrilateralShape(){
        return !(this.ab.isPointOnStraigthLine(this.bc.endPoint) || this.bc.isPointOnStraigthLine(this.cd.endPoint) || this.cd.isPointOnStraigthLine(this.da.endPoint) || this.da.isPointOnStraigthLine(this.ab.endPoint));
    }

    // 全ての内角が90°か
    isAllAngleNinety(){
        let isAngleABC90 = this.ab.isIntersectVertically(this.bc);
        let isAngleBCD90 = this.bc.isIntersectVertically(this.cd);
        let isAngleCDA90 = this.cd.isIntersectVertically(this.da);
        let isAngleDAB90 = this.da.isIntersectVertically(this.ab);
        return isAngleABC90 && isAngleBCD90 && isAngleCDA90 && isAngleDAB90;
    }

    // 全ての内角の和が360°か
    isSumAngleThreeHundredSixtyDegrees(){
        let a = this.a;
        let b = this.b;
        let c = this.c;
        let d = this.d;
        return this.angle(a, d, c) + this.angle(b, a, d) + this.angle(d, c, b) + this.angle(c, b, a) == 360;
    }

    // 全ての辺が同じ長さか
    isAllSameLengthSides(){
        let len = this.ab.length();
        return len == this.bc.length() && len == this.cd.length() && len == this.da.length();
    }

    // 平行な辺が何組あるか
    numberOfParallelSides(){
        let count = 0;
        if(this.ab.isParallelLine(this.cd)) count++;
        if(this.bc.isParallelLine(this.da)) count++;
        return count;
    }

    // 凧形の四角形か
    isKite(){
        let abLen = this.ab.length();
        let bcLen = this.bc.length();
        let cdLen = this.cd.length();
        let daLen = this.da.length();
        return abLen == bcLen && cdLen == daLen || abLen == daLen && bcLen == cdLen;
    }

    isTwistedQuadrilateral(){
        let ab = this.ab;
        let ax = ab.startPoint.x;
        let bx = ab.endPoint.x;
        let rangeABMax = ax > bx ? ax : bx;
        let rangeABMin = ax < bx ? ax : bx;

        let bc = this.bc;
        let cx = bc.endPoint.x;
        let rangeBCMax = bx > cx ? bx : cx;
        let rangeBCMin = bx < cx ? bx : cx;

        let cd = this.cd;
        let da = this.da;
        //return (ab.intersectionX(cd) > ab.startPoint.x && ab.intersectionX(cd) < ab.endPoint.x) || (bc.intersectionX(da) > bc.startPoint.x && bc.intersectionX(da) < bc.endPoint.x)
        return  (ab.intersectionX(cd) > rangeABMin && ab.intersectionX(cd) < rangeABMax ) || (bc.intersectionX(da) > rangeBCMin && bc.intersectionX(da) < rangeBCMax);
    }

    twistedQuadrilateralIntersectionX(){
        let ab = this.ab;
        let ax = ab.startPoint.x;
        let bx = ab.endPoint.x;
        let rangeABMax = ax > bx ? ax : bx;
        let rangeABMin = ax < bx ? ax : bx;

        let bc = this.bc;
        let cx = bc.endPoint.x;
        let rangeBCMax = bx > cx ? bx : cx;
        let rangeBCMin = bx < cx ? bx : cx;

        let cd = this.cd;
        let da = this.da;
        if(ab.intersectionX(cd) > rangeABMin && ab.intersectionX(cd) < rangeABMax ) return ab.intersectionX(cd);
        else if(bc.intersectionX(da) > rangeBCMin && bc.intersectionX(da) < rangeBCMax) return bc.intersectionX(da);
    }

    // 四角形か
    isSquare(){
        return this.numberOfParallelSides() == 2 && this.isAllSameLengthSides() && this.isAllAngleNinety() 
    }

    // ひし形か
    isRhombus(){
        return this.numberOfParallelSides() == 2 && this.isAllSameLengthSides()
    }

    // 長方形か
    isRectangle(){
        return this.numberOfParallelSides() == 2 && this.isAllAngleNinety()
    }

    // 平行四辺形か
    isParallelogram(){
        return this.numberOfParallelSides() == 2 && !(this.isAllSameLengthSides() || this.isAllAngleNinety())
    }

    // 四角形の形を返す(String)
    getShapeType(){
        // 四角形
        if (this.isQuadrilateralShape()){ 
            // ねじれ四辺形
            if(this.isTwistedQuadrilateral()) {
                return "other(その他）"
            }
            // 平行な対辺の数
            let numberOfParallelSides = this.numberOfParallelSides();
            if(numberOfParallelSides == 0){
                // 凧型
                if(this.isKite()) return "kite(凧)";
                else return "other（その他）";
            }else if(numberOfParallelSides == 1){
                if (this.isSumAngleThreeHundredSixtyDegrees()) {
                    return "trapezoid(台形)";
                }
                //else return "other（その他）";
            } else if(numberOfParallelSides == 2) {
                // 全ての辺の長さが等しい && 全ての角が直角
                if(this.isSquare()) {
                    return "square(正方形)";
                }
                else if(this.isRhombus()) {
                    return "rhombus(ひし形)";
                }
                else if(this.isRectangle()) {
                    return "rectangle(長方形)";
                }
                else {
                    return "parallelogram(平行四辺形)";
                }
            }
        } else return "not a quadrilateral";
    }
}  

// 点A ,B ,C,Dを結んだ図形がどんな形の四角形かを判別する関数(戻り値String)
function getShapeType(ax,ay,bx,by,cx,cy,dx,dy){
    //点をインスタンス化
    let a = new Point(ax, ay);
    let b = new Point(bx, by);
    let c = new Point(cx, cy);
    let d = new Point(dx, dy);

    //四角形ABCDをインスタンス化
    let abcd = new QuadrilateralShape(a, b, c, d);
    return abcd.getShapeType();
}

// 一次方程式の連立方程式 a:傾き,b:切片
function SimultaneousEquations(a, b, a2, b2){
    return (b2 - b) / (a - a2);
}

// テスト用データ
//　正方形
let abcd = getShapeType(0,0,5,0,5,5,0,5);

//let abcd = getShapeType(942,782,942,909,728,234,728,782);
// let a = abcd.a;
// let b = abcd.b;
// let c = abcd.c;
// let d = abcd.d;
// console.log(abcd.angle(b, a, d));
// console.log(abcd.angle(a, d, c));
// console.log(abcd.angle(d, c, b));
// console.log(abcd.angle(c, b, a));
// console.log(abcd.isSumAngleThreeHundredSixtyDegrees());
// console.log("平行な辺" + abcd.numberOfParallelSides());
// console.log("AB // CD" + abcd.ab.isParallelLine(abcd.cd));
// console.log("BC // CD" + abcd.bc.isParallelLine(abcd.da));
// console.log(abcd.ab.inclination());
// console.log(abcd.bc.inclination());
// console.log(abcd.cd.inclination());
// console.log(abcd.da.inclination());
// console.log(abcd.isAllAngleNinety());
// console.log(abcd.ab.length());
// console.log(abcd.bc.length());
// console.log(abcd.cd.length());
// console.log(abcd.da.length());
//console.log(abcd.getPerimeter());
// console.log(abcd.getArea());
// console.log(abcd.ab.intersectionX(abcd.cd));
// console.log(abcd.bc.intersectionX(abcd.da));
// console.log(abcd.bc.startPoint.x);
// console.log(abcd.bc.endPoint.x);
// console.log(abcd.isTwistedQuadrilateral());
console.log(abcd);
//abcd.draw();

//console.log(getShapeType(1,1,2,2,3,3,4,4)); //not
// console.log(getShapeType(0,0,1,0,1,1,4,-5)); //other（その他）
// console.log(getShapeType(-2,0,5,0,8,8,-1,8)); //trapezoid(台形)
// console.log(getShapeType(-4,3,5,6,2,-2,-7,-5)); //parallelogram(平行四辺形)
// console.log(getShapeType(0,0,5,0,8,4,3,4)); //rhombus(ひし形)
// console.log(getShapeType(-7,2,5,6,7,0,-5,-4)); //rectangle(長方形)
// console.log(getShapeType(0,2,2,2,2,4,0,4)); //square(正方形)
// console.log(getShapeType(0,0,5,3,0,8,-5,3)); // kite
// console.log(getShapeType(-5,7,2,6,5,-3,-4,0)); // kite
// console.log(getShapeType(-1,5,3,1,-1,-1,-5,1)); // kite
// console.log(getShapeType(942,782,942,909,728,234,728,782)); // other