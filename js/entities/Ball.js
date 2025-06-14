import { FIELD, BALL } from '../config.js';

// ----- Soccer Ball -----
export default class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 12;
        this.vx = 0;
        this.vy = 0;
    }

    update() {
        // Apply friction
        this.vx *= BALL.FRICTION;
        this.vy *= BALL.FRICTION;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Check goal post collisions
        this.handleGoalPostCollisions();

        // Bounce off field boundaries, allowing for goals
        const goalH = FIELD.GOAL_HEIGHT;
        const goalTop = (canvas.height - goalH) / 2;
        const goalBottom = goalTop + goalH;
        const inGoalMouthY = this.y > goalTop && this.y < goalBottom;

        if (this.x - this.r < FIELD.MARGIN && !inGoalMouthY) { this.x = FIELD.MARGIN + this.r; this.vx *= -0.6; }
        if (this.x + this.r > canvas.width - FIELD.MARGIN && !inGoalMouthY) { this.x = canvas.width - FIELD.MARGIN - this.r; this.vx *= -0.6; }
        if (this.y - this.r < FIELD.MARGIN) { this.y = FIELD.MARGIN + this.r; this.vy *= -0.6; }
        if (this.y + this.r > canvas.height - FIELD.MARGIN) { this.y = canvas.height - FIELD.MARGIN - this.r; this.vy *= -0.6; }
    }

    handleGoalPostCollisions() {
        const goalH = FIELD.GOAL_HEIGHT;
        const goalTop = (canvas.height - goalH) / 2;
        const goalBottom = goalTop + goalH;
        const postRadius = 8;
        const bounceForce = 1.5; // Strong bounce for ball

        // Left goal posts
        const leftTopPost = { x: FIELD.MARGIN, y: goalTop };
        const leftBottomPost = { x: FIELD.MARGIN, y: goalBottom };
        
        // Right goal posts  
        const rightTopPost = { x: canvas.width - FIELD.MARGIN, y: goalTop };
        const rightBottomPost = { x: canvas.width - FIELD.MARGIN, y: goalBottom };

        const posts = [leftTopPost, leftBottomPost, rightTopPost, rightBottomPost];

        posts.forEach(post => {
            const dx = this.x - post.x;
            const dy = this.y - post.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < this.r + postRadius) {
                // Collision detected - push ball out and apply strong bounce
                const overlap = (this.r + postRadius) - dist + 1;
                const nx = dx / dist;
                const ny = dy / dist;
                
                // Push ball out of collision
                this.x += nx * overlap;
                this.y += ny * overlap;
                
                // Apply strong bounce force
                const speed = Math.hypot(this.vx, this.vy);
                this.vx = nx * Math.max(speed * bounceForce, 8);
                this.vy = ny * Math.max(speed * bounceForce, 8);
            }
        });
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + worldOffsetX, this.y + worldOffsetY);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}


