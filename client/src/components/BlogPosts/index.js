import { connect } from "react-redux";

import BlogPosts from "./BlogPosts";
import { getBlogPosts } from "../../Redux/BlogPosts/actions";

const mapStateToProps = (state) => {
  return {
    blogPosts: state.blogPosts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBlogPosts: () => {
      dispatch(getBlogPosts());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogPosts);
