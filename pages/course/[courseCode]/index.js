import { useRouter } from 'next/router';
import React from 'react';

import { BUILD_TIME_COURSE_LIMIT } from '../../../common/constants';
import {
  getCourseListApiUrl,
  getCourseDetailApiUrl,
  getCourseTagListApiUrl,
  getCourseGradeListApiUrl,
} from '../../../common/urls';
import { fetcher } from '../../../common/fetcher';
import { sortSemesters } from '../../../common/sortSemesters';
import { Tags } from '../../../components/Tags';
import { Facts } from '../../../components/Facts';
import { CourseContent } from '../../../components/CourseContent';
import { CourseCharts } from '../../../components/CourseCharts';

export const getStaticPaths = async () => {
  const limit = BUILD_TIME_COURSE_LIMIT;
  const response = await fetcher(getCourseListApiUrl({ limit }));
  const courseCodes = response.results.map((course) => course.code);
  const paths = courseCodes.map((courseCode) => ({ params: { courseCode } }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { courseCode } = params;
  const [initialCourse, initalGrades, initalTags] = await Promise.all([
    fetcher(getCourseDetailApiUrl(courseCode)),
    fetcher(getCourseGradeListApiUrl(courseCode)),
    fetcher(getCourseTagListApiUrl(courseCode)),
  ]);
  return {
    unstable_revalidate: 60, // Revalidate once each hour.
    props: {
      initialCourse,
      initalGrades,
      initalTags,
    },
  };
};

const CourseDetailPage = ({ initialCourse, initalGrades, initalTags }) => {
  const { isFallback, query } = useRouter();
  const { courseCode } = query;

  if (isFallback || !courseCode) {
    return 'Loading...';
  }

  const course = initialCourse;
  const grades = initalGrades.results.sort(sortSemesters);
  const tags = initalTags.results;

  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <CourseContent course={course} />
        </div>
        <div className="col-md-4">
          <CourseCharts grades={grades} />
          <Facts course={course} />
          <Tags tags={tags} />
        </div>
      </div>
    </>
  );
};

export default CourseDetailPage;
