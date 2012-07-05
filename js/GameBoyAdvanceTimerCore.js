/* 
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012 Grant Galitz
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 * The full license is available at http://www.gnu.org/licenses/gpl.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 */
function GameBoyAdvanceTimer(IOCore) {
	//Build references:
	this.IOCore = IOCore;
	this.initializeTimers();
}
GameBoyAdvanceTimer.prototype.initializeTimers = function (data) {
	this.timer0Counter = 0;
	this.timer0Reload = 0;
	this.timer0Control = 0;
	this.timer0Enabled = false;
	this.timer0IRQ = false;
	this.timer0Precounter = 0;
	this.timer0Prescalar = 1;
	this.timer1Counter = 0;
	this.timer1Reload = 0;
	this.timer1Control = 0;
	this.timer1Enabled = false;
	this.timer1IRQ = false;
	this.timer1Precounter = 0;
	this.timer1Prescalar = 1;
	this.timer1CountUp = false;
	this.timer2Counter = 0;
	this.timer2Reload = 0;
	this.timer2Control = 0;
	this.timer2Enabled = false;
	this.timer2IRQ = false;
	this.timer2Precounter = 0;
	this.timer2Prescalar = 1;
	this.timer2CountUp = false;
	this.timer3Counter = 0;
	this.timer3Reload = 0;
	this.timer3Control = 0;
	this.timer3Enabled = false;
	this.timer3IRQ = false;
	this.timer3Precounter = 0;
	this.timer3Prescalar = 1;
	this.timer3CountUp = false;
}
GameBoyAdvanceTimer.prototype.addClocks = function (clocks) {
	//See if timer channel 0 is enabled:
	if (this.timer0Enabled) {
		this.timer0Precounter += clocks;
		while (this.timer0Precounter >= this.timer0Prescalar) {
			this.timer0Precounter -= this.timer0Prescalar;
			if (++this.timer0Counter > 0xFFFF) {
				this.timer0Counter = this.timer0Reload;
				this.timer0ExternalTriggerCheck();
				this.timer1ClockUpTickCheck();
			}
		}
	}
	//See if timer channel 1 is enabled:
	if (this.timer1Enabled && !this.timer1CountUp) {
		this.timer1Precounter += clocks;
		while (this.timer1Precounter >= this.timer1Prescalar) {
			this.timer1Precounter -= this.timer1Prescalar;
			if (++this.timer1Counter > 0xFFFF) {
				this.timer1Counter = this.timer1Reload;
				this.timer1ExternalTriggerCheck();
				this.timer2ClockUpTickCheck();
			}
		}
	}
	//See if timer channel 2 is enabled:
	if (this.timer2Enabled && !this.timer2CountUp) {
		this.timer2Precounter += clocks;
		while (this.timer2Precounter >= this.timer2Prescalar) {
			this.timer2Precounter -= this.timer2Prescalar;
			if (++this.timer2Counter > 0xFFFF) {
				this.timer2Counter = this.timer2Reload;
				this.timer2ExternalTriggerCheck();
				this.timer3ClockUpTickCheck();
			}
		}
	}
	//See if timer channel 3 is enabled:
	if (this.timer3Enabled && !this.timer3CountUp) {
		this.timer3Precounter += clocks;
		while (this.timer3Precounter >= this.timer3Prescalar) {
			this.timer3Precounter -= this.timer3Prescalar;
			if (++this.timer3Counter > 0xFFFF) {
				this.timer3Counter = this.timer3Reload;
				this.timer3ExternalTriggerCheck();
			}
		}
	}
}
GameBoyAdvanceTimer.prototype.timer1ClockUpTickCheck = function () {
	if (this.timer1Enabled && this.timer1CountUp) {
		if (++this.timer1Counter > 0xFFFF) {
			this.timer1Counter = this.timer1Reload;
			this.timer1ExternalTriggerCheck();
			this.timer2ClockUpTickCheck();
		}
	}
}
GameBoyAdvanceTimer.prototype.timer2ClockUpTickCheck = function () {
	if (this.timer2Enabled && this.timer2CountUp) {
		if (++this.timer2Counter > 0xFFFF) {
			this.timer2Counter = this.timer2Reload;
			this.timer2ExternalTriggerCheck();
			this.timer3ClockUpTickCheck();
		}
	}
}
GameBoyAdvanceTimer.prototype.timer3ClockUpTickCheck = function () {
	if (this.timer3Enabled && this.timer3CountUp) {
		if (++this.timer3Counter > 0xFFFF) {
			this.timer3Counter = this.timer3Reload;
			this.timer3ExternalTriggerCheck();
		}
	}
}
GameBoyAdvanceTimer.prototype.timer0ExternalTriggerCheck = function () {
	if (this.timer0IRQ) {
		this.IOCore.irq.requestIRQ(0x08);
	}
	this.IOCore.sound.AGBDirectSoundTimer0ClockTick();
}
GameBoyAdvanceTimer.prototype.timer1ExternalTriggerCheck = function () {
	if (this.timer1IRQ) {
		this.IOCore.irq.requestIRQ(0x10);
	}
	this.IOCore.sound.AGBDirectSoundTimer1ClockTick();
}
GameBoyAdvanceTimer.prototype.timer2ExternalTriggerCheck = function () {
	if (this.timer2IRQ) {
		this.IOCore.irq.requestIRQ(0x20);
	}
}
GameBoyAdvanceTimer.prototype.timer3ExternalTriggerCheck = function () {
	if (this.timer3IRQ) {
		this.IOCore.irq.requestIRQ(0x40);
	}
}
GameBoyAdvanceTimer.prototype.writeTM0CNT_L = function (data) {
	this.timer0Reload &= 0xFF00;
	this.timer0Reload |= data;
}
GameBoyAdvanceTimer.prototype.writeTM0CNT_H = function (data) {
	this.timer0Reload &= 0xFF;
	this.timer0Reload |= data << 8;
}
GameBoyAdvanceTimer.prototype.readTM0CNT_L = function () {
	return this.timer0Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM0CNT_H = function () {
	return (this.timer0Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.writeTM1CNT_L = function (data) {
	this.timer1Reload &= 0xFF00;
	this.timer1Reload |= data;
}
GameBoyAdvanceTimer.prototype.writeTM1CNT_H = function (data) {
	this.timer1Reload &= 0xFF;
	this.timer1Reload |= data << 8;
}
GameBoyAdvanceTimer.prototype.readTM1CNT_L = function () {
	return this.timer1Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM1CNT_H = function () {
	return (this.timer1Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.writeTM2CNT_L = function (data) {
	this.timer2Reload &= 0xFF00;
	this.timer2Reload |= data;
}
GameBoyAdvanceTimer.prototype.writeTM2CNT_H = function (data) {
	this.timer2Reload &= 0xFF;
	this.timer2Reload |= data << 8;
}
GameBoyAdvanceTimer.prototype.readTM2CNT_L = function () {
	return this.timer2Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM2CNT_H = function () {
	return (this.timer2Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.writeTM3CNT_L = function (data) {
	this.timer3Reload &= 0xFF00;
	this.timer3Reload |= data;
}
GameBoyAdvanceTimer.prototype.writeTM3CNT_H = function (data) {
	this.timer3Reload &= 0xFF;
	this.timer3Reload |= data << 8;
}
GameBoyAdvanceTimer.prototype.readTM3CNT_L = function () {
	return this.timer3Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM3CNT_H = function () {
	return (this.timer3Counter & 0xFF00) >> 8;
}