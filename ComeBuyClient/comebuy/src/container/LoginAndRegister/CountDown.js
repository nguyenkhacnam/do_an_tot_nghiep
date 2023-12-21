import React from 'react';
import ReactDOM from 'react-dom';

export default class CountDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 60
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            let { count } = this.state;
            this.setState({
                count: count - 1
            })
        }, 1000)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.count !== this.state.count && this.state.count === 0) {
            clearInterval(this.timer);
            if (this.props.onTimesup) {
                this.props.onTimesup();
            }
        }
    }

    fmtMSS(s) { return (s - (s % 60)) / 60 + (9 < s ? ':' : ':0') + s }

    render() {
        let { count } = this.state;
        return (
            <h1 style={{ marginRight: '10px', marginTop: '10px', fontSize: '20px', fontWeight: 'italic', color: 'red' }}>
                {this.fmtMSS(count)}s
            </h1>
        )
    }
}