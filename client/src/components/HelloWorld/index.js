import { connect } from 'react-redux';

import HelloWorld from './HelloWorld';
import { getMessage } from '../../Redux/HelloWorld/actions';

const mapStateToProps = (state) => {
    return {
        message: state.message
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMessage: () => {
            dispatch(getMessage());
        },
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HelloWorld);