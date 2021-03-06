import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native'

import TaskRunner, {
    addTask,
    retryTask,
    PENDING,
    IN_PROGRESS,
    clearQueue,
    getQueue,
    resetQueue,
} from '../src'
import type { Task } from '../src'

import Test from './Test'
import { FAILED } from '../src/statusTypes'

const queueNames = ['TEST']

type State = {
    success: number,
    counter: number,
    failed: number,
}

export default class App extends React.Component<{}, State> {
    state = {
        success: 0,
        counter: 0,
        failed: 0,
    }

    handleDone = (count: number) => {
        const queue = getQueue('TEST')
        const counter = queue.filter(item => item.status === PENDING || item.status === IN_PROGRESS)
            .length
        this.setState(state => ({ counter, success: state.success + 1 }))
    }

    getQueueLengths = (): { counter: number, failed: number } => {
        const queue = getQueue('TEST')
        const counter = queue.filter(item => item.status === PENDING || item.status === IN_PROGRESS)
            .length
        const failed = queue.filter(item => item.status === FAILED).length

        return { counter, failed }
    }

    handleFailed = (task: Task) => {
        const queue = this.getQueueLengths()
        const { counter, failed } = queue
        this.setState({ counter, failed })
    }

    handleAdd = () => {
        const id = (Math.random() * 100000).toString()
        addTask('TEST', { id, status: PENDING })
        const queue = this.getQueueLengths()
        const { counter } = queue
        this.setState({ counter })
    }

    handleRetry = () => {
        const task = getQueue('TEST').filter(item => item.status === FAILED)[0]
        retryTask('TEST', task)
        const queue = this.getQueueLengths()
        const { counter, failed } = queue
        this.setState({ counter, failed })
    }

    handleClear = () => {
        clearQueue('TEST')
        const queue = this.getQueueLengths()
        const { counter, failed, success } = queue
        this.setState({ counter, failed })
    }

    handleReset = () => {
        resetQueue('TEST')
        const queue = this.getQueueLengths()
        const { counter, failed, success } = queue
        this.setState({ counter, failed })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 30 }}>Queue: {this.state.counter}</Text>
                <Text style={{ fontSize: 30 }}>Success: {this.state.success}</Text>
                <Text style={{ fontSize: 30 }}>Failed: {this.state.failed}</Text>
                <TouchableOpacity onPress={this.handleAdd} style={{ margin: 40 }}>
                    <Text>Add Task!</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleRetry} style={{ margin: 40 }}>
                    <Text>Retry!</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleClear} style={{ margin: 40 }}>
                    <Text>Clear Queue!</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleReset} style={{ margin: 40 }}>
                    <Text>Reset Queue!</Text>
                </TouchableOpacity>
                <TaskRunner queueNames={queueNames} storage={AsyncStorage}>
                    <Test onDone={this.handleDone} onFailed={this.handleFailed} />
                </TaskRunner>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
