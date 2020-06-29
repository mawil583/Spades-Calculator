import { connect } from 'react-redux';

import Counter from './Counter';
import { increment, decrement } from '../../Redux/Counter/actions';

const mapStateToProps = (state) => {
    return {
        count: state.counter
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        increment: () => {
            dispatch(increment());
        },
        decrement: () => {
            dispatch(decrement());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);