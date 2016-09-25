<div class="testimonial">
  <hr class="thick-1 color-000000">
  <p class="testimonial__quote">&laquo; <?php echo get_the_content($post); ?> &raquo;</p>
  <?php echo get_the_post_thumbnail($post, 'thumbnail', array('class' => 'testimonial__portrait img-responsive img-circle')); ?>
  <p class="testimonial__person"><?php echo get_the_title($post); ?></p>
  <p class="testimonial__position"><?php the_field('sub-title', $post); ?></p>
  <hr class="thick-1 color-000000">
</div>