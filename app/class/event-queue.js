class EventQueue {
    constructor(interval) {
        this.queue = [];
        this.interval = interval;
        this.processing = false;
    }

    enqueue(event) {
        this.queue.push(event);
        if (!this.processing) this.startProcessing(); 
    }

    startProcessing() {
        this.processing = true;
        this.processNext();
    }

    processNext() {
        if (this.queue.length === 0) {
            this.processing = false;
            return;
        }

        const event = this.queue.shift();
        event();
        // condicion -> 
        setTimeout(() => this.processNext(), this.interval);
    }

    
}

module.exports = EventQueue;