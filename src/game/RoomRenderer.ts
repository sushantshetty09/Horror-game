import type { ClueID, MonsterPos } from '../types';

export class RoomRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  render(state: {
    lightLevel: number;
    noiseAmount: number;
    monsterPosition: MonsterPos;
    clueVisible: ClueID[];
    frame: number;
  }) {
    const { ctx, width, height } = this;

    ctx.clearRect(0, 0, width, height);
    this.drawRoom();
    this.drawClues(state.clueVisible, state.lightLevel);
    this.drawMonster(state.monsterPosition, state.frame, state.lightLevel);

    ctx.fillStyle = `rgba(0, 0, 0, ${1 - state.lightLevel})`;
    ctx.fillRect(0, 0, width, height);

    if (state.noiseAmount > 0) this.drawNoise(state.noiseAmount);
    this.drawScanlines();
  }

  private drawRoom() {
    const { ctx, width, height } = this;
    const floorGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
    floorGrad.addColorStop(0, '#1a1008');
    floorGrad.addColorStop(1, '#0d0804');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, height * 0.5, width, height * 0.5);

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height * 0.3);

    const wallGrad = ctx.createLinearGradient(0, height * 0.3, 0, height * 0.5);
    wallGrad.addColorStop(0, '#1c1008');
    wallGrad.addColorStop(1, '#140c06');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, height * 0.3, width, height * 0.2);

    ctx.fillStyle = '#0f0a04';
    ctx.fillRect(width * 0.7, height * 0.25, width * 0.12, height * 0.25);
    ctx.strokeStyle = '#3a2a15';
    ctx.lineWidth = 2;
    ctx.strokeRect(width * 0.7, height * 0.25, width * 0.12, height * 0.25);

    ctx.fillStyle = '#050a0d';
    ctx.fillRect(width * 0.1, height * 0.28, width * 0.15, height * 0.18);
    ctx.strokeStyle = '#2a3530';
    ctx.lineWidth = 3;
    ctx.strokeRect(width * 0.1, height * 0.28, width * 0.15, height * 0.18);

    ctx.fillStyle = '#0d1215';
    ctx.fillRect(width * 0.35, height * 0.3, width * 0.08, height * 0.18);
    ctx.strokeStyle = '#4a3820';
    ctx.lineWidth = 2;
    ctx.strokeRect(width * 0.35, height * 0.3, width * 0.08, height * 0.18);

    const vigStrength = 0.4 + Math.sin(Date.now() * 0.001) * 0.05;
    const vig = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, width * 0.7);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(0,0,0,${vigStrength})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, width, height);
  }

  private drawMonster(pos: MonsterPos, frame: number, lightLevel: number) {
    if (pos === 'GONE') return;

    const { ctx, width, height } = this;
    const breathe = Math.sin(frame * 0.05) * 3;

    const positions: Record<MonsterPos, { x: number; y: number; scale: number }> = {
      BEHIND_CAMERA: { x: width / 2, y: height * 1.1, scale: 4 },
      DOORWAY: { x: width * 0.76, y: height * 0.34, scale: 0.7 },
      WINDOW: { x: width * 0.175, y: height * 0.33, scale: 0.55 },
      MIRROR: { x: width * 0.39, y: height * 0.35, scale: 0.5 },
      CORNER: { x: width * 0.88, y: height * 0.6, scale: 1 },
      GONE: { x: 0, y: 0, scale: 0 },
    };

    const { x, y, scale } = positions[pos];
    const alpha = Math.max(0.15, lightLevel * 0.9);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y + breathe);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#050505';
    ctx.fillRect(-6, -40, 12, 40);

    ctx.beginPath();
    ctx.ellipse(0, -48, 8, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#080808';
    ctx.fill();

    if (lightLevel > 0.15) {
      ctx.fillStyle = `rgba(255, 255, 255, ${lightLevel})`;
      ctx.fillRect(-3, -52, 2, 2);
      ctx.fillRect(2, -52, 2, 2);
    }

    ctx.strokeStyle = '#030303';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.lineTo(-20, -10 + breathe * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, -30);
    ctx.lineTo(20, -10 + breathe * 2);
    ctx.stroke();

    ctx.restore();

    if (pos !== 'BEHIND_CAMERA') {
      const eyeGlow = ctx.createRadialGradient(x - 3 * scale, y - 52 * scale + breathe, 0, x, y - 52 * scale, 20 * scale);
      eyeGlow.addColorStop(0, 'rgba(255, 30, 30, 0.5)');
      eyeGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = eyeGlow;
      ctx.fillRect(x - 20 * scale, y - 70 * scale, 40 * scale, 30 * scale);
    }
  }

  private drawClues(clueVisible: ClueID[], lightLevel: number) {
    if (lightLevel < 0.15) return;

    const { ctx, width, height } = this;

    const clueMap: Record<ClueID, { x: number; y: number; symbol: string; color: string }> = {
      CLUE_LETTER_A: { x: width * 0.73, y: height * 0.42, symbol: 'A', color: '#ff4444' },
      CLUE_LETTER_B: { x: width * 0.13, y: height * 0.42, symbol: 'B', color: '#ff8800' },
      CLUE_NUMBER_1: { x: width * 0.37, y: height * 0.44, symbol: '1', color: '#ffff44' },
      CLUE_NUMBER_2: { x: width * 0.87, y: height * 0.72, symbol: '2', color: '#44ff88' },
      CLUE_FINAL: { x: width * 0.5, y: height * 0.8, symbol: 'EXIT →', color: '#44ddff' },
    };

    for (const clueId of clueVisible) {
      const clue = clueMap[clueId];
      const alpha = Math.min(1, (lightLevel - 0.15) * 3);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = clue.color;
      ctx.shadowBlur = 10 + Math.sin(Date.now() * 0.003) * 4;
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = clue.color;
      ctx.textAlign = 'center';
      ctx.fillText(clue.symbol, clue.x, clue.y);
      ctx.restore();
    }
  }

  private drawNoise(amount: number) {
    const { ctx, width, height } = this;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 255 * amount;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
  }

  private drawScanlines() {
    const { ctx, width, height } = this;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }
  }
}
