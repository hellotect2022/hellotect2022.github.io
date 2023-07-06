import React,{useMemo} from "react"
import { Link, graphql } from 'gatsby'
import GlobalStyle from 'components/Common/GlobalStyle'
import Introduction from 'components/Main/Introduction'
import styled from "@emotion/styled"
import Footer from "../components/Common/Footer"
import CategoryList from "../components/Main/CategoryList"
import PostList from "../components/Main/PostList"
import queryString, { ParsedQuery } from 'query-string'
import Template from "../components/Common/Template"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const CATEGORY_LIST = {
  All: 5,
  Web: 3,
  Mobile: 2,
}

const IndexPage = ({
  location:{search},
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  console.log("edges",edges);
  console.log("search",search);

  const parsed = queryString.parse(search)
  const selectedCategory =
    typeof parsed.category !== 'string' || !parsed.category
      ? 'All'
      : parsed.category

      const categoryList = useMemo(() =>
          edges.reduce(
            (list,
              {
                node: {
                  frontmatter: { categories },
                },
              },
            ) => {
              categories.forEach(category => {
                if (list[category] === undefined) list[category] = 1;
                else list[category]++;
              });
    
              list['All']++;
    
              return list;
            },
            { All: 0 },
          ),
        [],
      )

  return (
    <Template>
      <Introduction />
      <CategoryList selectedCategory={selectedCategory} categoryList={categoryList} />
      <PostList selectedCategory={selectedCategory} posts={edges}/>
      <Footer />
    </Template>
    // <div>
    //   <ul>
    //     <li><a href="/info/">To Info</a></li>
    //     <li><Link to="/info/">To Info</Link></li>
    //   </ul>
    // </div>
  )
}

export default IndexPage


export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              #publicURL
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
          }
        }
      }
    }
  }
`