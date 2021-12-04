//并发请求
const urls = [
    {info: 'link1', time: 3000},
    {info: 'link2', time: 2000},
    {info: 'link3', time: 4000},
    {info: 'link4', time: 1000},
    {info: 'link5', time: 2000},
    {info: 'link6', time: 3000},
    {info: 'link7', time: 1000},
    {info: 'link8', time: 2000}
]
function sendRequest(url) {
    return new Promise((resolve, reject) => {
        console.log(`****${url.info}--start!!!`);
        setTimeout(() => {
            console.log(`${url.info}--end!!!`);
            resolve()
        }, url.time)
    })
}

function limitRequest(urls, handler, limit) {
    const sequence = [...urls]
    let promises = []
    promises = sequence.splice(0, limit).map((url, index) => {
        return handler(url).then(
            () => {
                return index
            }
        )
    })
    let p = Promise.race(promises)
    for (let i = 0; i < sequence.length; i++) {
        p = p.then(res => {
            // res为promises的数组下标
            promises[res] = handler(sequence[i]).then(() => {
                return res
            })
            return Promise.race(promises)
        })
    }
}

limitRequest(urls, sendRequest, 3)

// 并发请求 + 高优任务
const urls = [
    {info: 'link1', time: 3000, priority: 1},
    {info: 'link2', time: 2000, priority: 4},
    {info: 'link3', time: 4000, priority: 2},
    {info: 'link4', time: 1000, priority: 1},
    {info: 'link5', time: 2000, priority: 5},
    {info: 'link6', time: 3000, priority: 1},
    {info: 'link7', time: 1000, priority: 3},
    {info: 'link8', time: 2000, priority: 6}
]
function sendRequest(url) {
    return new Promise((resolve, reject) => {
        console.log(`****${url.info}--start!!!`);
        setTimeout(() => {
            console.log(`${url.info}--end!!!`);
            resolve()
        }, url.time)
    })
}

class PromiseQueue {
    constructor(options = {}) {
        this.concurrency = options.concurrency || 1
        this.currentCount = 0
        this.pendingList = []
    }
    add(task) {
        this.pendingList.push(task)
        this.execute()
    }
    execute() {
        if(this.pendingList.length < 1 || this.concurrency === this.currentCount) return
        this.currentCount++
        const { fn } = this.pendingList.sort((a, b) => b.priority - a.priority).shift() 
        fn().then(this.completeOne.bind(this)).catch(this.completeOne.bind(this))
    }
    completeOne() {
        this.currentCount--
        this.execute()
    }
}

const queue = new PromiseQueue({concurrency: 3})
function formatTask(url){
    return {
        fn: () =>sendRequest(url),
        priority: url.priority
    }
}
urls.forEach(url => {
    queue.add(formatTask(url))
})
const highPriorityTask =  {info: 'hight!!!!!', time: 1000, priority: 9}
queue.add(formatTask(highPriorityTask))
